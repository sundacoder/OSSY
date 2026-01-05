export interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  description?: string;
}

export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  baseToken: {
    name: string;
    symbol: string;
    address: string;
  };
  priceUsd?: string;
  liquidity: {
    usd: number;
  };
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  marketCap?: number;
  pairCreatedAt: number;
  info?: {
    websites?: Array<{ url: string }>;
    socials?: Array<{
      platform: string;
      url: string;
    }>;
  };
}

export interface FilteredTokenDetails {
  name: string;
  symbol: string;
  chain: string;
  dex: string;
  liquidity: string;
  liquidityRaw: number;
  price: string;
  marketCap: string;
  marketCapRaw: number;
  volume24h: string;
  volume24hRaw: number;
  priceChange24h: string;
  priceChangeRaw: number;
  age: string;
  ageDays: number;
  website: string;
  twitter: string;
  dexScreenerUrl: string;
}

export interface FilterArgs {
  chain?: string;
  minVolume24h?: number;
  minLiquidity?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  maxAgeDays?: number;
}

export enum StrategyType {
  AGGRESSIVE = 'Aggressive',
  GROWTH = 'Growth',
  INFLATION_FIGHTING = 'Inflation Fighting',
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  tokens?: FilteredTokenDetails[];
  isLoading?: boolean;
}