import React from 'react';
import { FilteredTokenDetails } from '../types';
import { ExternalLink, Twitter, Activity } from 'lucide-react';

interface Props {
  tokens: FilteredTokenDetails[];
}

export const TokenList: React.FC<Props> = ({ tokens }) => {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
        <Activity className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
        <h3 className="text-lg font-medium text-zinc-300">No Tokens Found</h3>
        <p className="text-zinc-500">The agent logic filtered out all candidates based on the strict criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="px-6 py-4 font-semibold text-zinc-300">Token</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-right">Price</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-right">24h Change</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-right">Liquidity</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-right">Mkt Cap</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-right">Age</th>
              <th className="px-6 py-4 font-semibold text-zinc-300 text-center">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {tokens.map((token, idx) => (
              <tr key={idx} className="group hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-base">{token.symbol}</span>
                    <span className="text-xs text-zinc-500">{token.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 mt-1">{token.chain}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-zinc-300">
                  {token.price}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  <span className={token.priceChangeRaw >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {token.priceChangeRaw > 0 ? '+' : ''}{token.priceChange24h}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-zinc-400">
                  {token.liquidity}
                </td>
                <td className="px-6 py-4 text-right font-mono text-zinc-300 font-medium">
                  {token.marketCap}
                </td>
                <td className="px-6 py-4 text-right text-zinc-400">
                   <span className="px-2 py-1 rounded bg-zinc-800 text-xs">
                    {token.age}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {token.website !== 'N/A' && (
                        <a href={token.website} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors">
                            <ExternalLink size={16} />
                        </a>
                    )}
                    {token.twitter !== 'N/A' && (
                        <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-sky-400 hover:bg-zinc-700 rounded-lg transition-colors">
                            <Twitter size={16} />
                        </a>
                    )}
                    <a href={token.dexScreenerUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-700 rounded-lg transition-colors" title="View on DexScreener">
                        <Activity size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};