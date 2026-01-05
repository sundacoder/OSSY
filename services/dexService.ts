import { FilterArgs, BoostedToken, TokenPair, FilteredTokenDetails } from '../types';

// Helper to simulate delay for better UX flow
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const filterTokens = async (args: FilterArgs): Promise<string> => {
  console.log('OSSY Agent executing filterTokens with args:', args);
  
  try {
    // 1. Get boosted tokens (simulating the OpenServ Agent logic)
    // Using fetch instead of axios for standard browser compatibility
    const response = await fetch('https://api.dexscreener.com/token-boosts/top/v1');
    if (!response.ok) throw new Error('Failed to fetch boosted tokens');
    
    const boostedTokens: BoostedToken[] = await response.json();

    // 2. Filter by chain
    const filteredBoostedTokens =
      (args.chain ?? '').trim() !== ''
        ? boostedTokens.filter(token => token.chainId.toLowerCase() === args.chain!.toLowerCase())
        : boostedTokens;

    // Limit to top 20 to avoid rate limits or overly long processing times in this demo
    const tokensToProcess = filteredBoostedTokens.slice(0, 20);

    // 3. Get detailed info
    const detailedTokens = await Promise.all(
      tokensToProcess.map(async (token) => {
        try {
          // Add small jitter to avoid strict rate limiting
          await delay(Math.random() * 200);
          
          const pairResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`);
          const pairData = await pairResponse.json();
          const pair = pairData.pairs?.[0] as TokenPair;

          if (!pair) return null;

          const now = Date.now();
          const maxAgeMs = args.maxAgeDays ? args.maxAgeDays * 24 * 60 * 60 * 1000 : Number.POSITIVE_INFINITY;

          // Helper for safe number checking
          const safeVal = (val: number | undefined) => val ?? 0;

          const meetsVolume = !args.minVolume24h || (pair.volume?.h24 && pair.volume.h24 >= args.minVolume24h);
          const meetsLiquidity = !args.minLiquidity || (pair.liquidity?.usd && pair.liquidity.usd >= args.minLiquidity);
          const meetsMinMcap = !args.minMarketCap || (pair.marketCap && pair.marketCap >= args.minMarketCap);
          const meetsMaxMcap = !args.maxMarketCap || (pair.marketCap && pair.marketCap <= args.maxMarketCap);
          const meetsAge = !args.maxAgeDays || (pair.pairCreatedAt && now - pair.pairCreatedAt <= maxAgeMs);

          if (meetsVolume && meetsLiquidity && meetsMinMcap && meetsMaxMcap && meetsAge) {
            const ageDays = pair.pairCreatedAt
              ? Math.floor((now - pair.pairCreatedAt) / (24 * 60 * 60 * 1000))
              : 0;

            const details: FilteredTokenDetails = {
              name: pair.baseToken.name,
              symbol: pair.baseToken.symbol,
              chain: pair.chainId,
              dex: pair.dexId,
              liquidity: pair.liquidity?.usd ? `$${pair.liquidity.usd.toLocaleString()}` : 'N/A',
              liquidityRaw: pair.liquidity?.usd ?? 0,
              price: pair.priceUsd ? `$${Number.parseFloat(pair.priceUsd).toFixed(6)}` : 'N/A',
              marketCap: pair.marketCap ? `$${pair.marketCap.toLocaleString()}` : 'N/A',
              marketCapRaw: pair.marketCap ?? 0,
              volume24h: pair.volume?.h24 ? `$${pair.volume.h24.toLocaleString()}` : 'N/A',
              volume24hRaw: pair.volume?.h24 ?? 0,
              priceChange24h: pair.priceChange?.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : 'N/A',
              priceChangeRaw: pair.priceChange?.h24 ?? 0,
              age: `${ageDays} days`,
              ageDays: ageDays,
              website: pair.info?.websites?.[0]?.url || 'N/A',
              twitter: pair.info?.socials?.find(social => social.platform === 'twitter')?.url || 'N/A',
              dexScreenerUrl: pair.url
            };
            return details;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching details for token ${token.tokenAddress}:`, error);
          return null;
        }
      })
    );

    const validTokens = detailedTokens.filter((token): token is FilteredTokenDetails => token !== null);
    
    // Sort logic based on implied strategy via args (heuristic)
    // If filtering for low age, sort by volume (Aggressive)
    // If filtering for high cap, sort by liquidity (Safe)
    if (args.maxAgeDays && args.maxAgeDays < 30) {
        validTokens.sort((a, b) => b.volume24hRaw - a.volume24hRaw);
    } else if (args.minMarketCap && args.minMarketCap > 10000000) {
        validTokens.sort((a, b) => b.liquidityRaw - a.liquidityRaw);
    } else {
        // Default sort by market cap
        validTokens.sort((a, b) => b.marketCapRaw - a.marketCapRaw);
    }

    return JSON.stringify(validTokens);
  } catch (error) {
    console.error('Error filtering tokens:', error);
    return JSON.stringify({ error: 'Error filtering tokens. The DexScreener API might be rate-limiting requests.' });
  }
};