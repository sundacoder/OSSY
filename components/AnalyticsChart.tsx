import React from 'react';
import { FilteredTokenDetails } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

interface Props {
  tokens: FilteredTokenDetails[];
}

export const AnalyticsChart: React.FC<Props> = ({ tokens }) => {
  if (tokens.length < 2) return null;

  // Transform data for chart: X=MarketCap, Y=Volume, Z=Liquidity (size)
  const data = tokens.map(t => ({
    name: t.symbol,
    x: t.marketCapRaw,
    y: t.volume24hRaw,
    z: t.liquidityRaw,
    priceChange: t.priceChangeRaw,
  }));

  return (
    <div className="h-[400px] w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-8">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-zinc-300 font-medium">Market Analysis</h3>
            <div className="text-xs text-zinc-500">Log Scale (Cap vs Volume)</div>
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Market Cap" 
            unit="$" 
            scale="log" 
            domain={['auto', 'auto']}
            tick={{fill: '#71717a', fontSize: 12}}
            tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Volume 24h" 
            unit="$" 
            scale="log" 
            domain={['auto', 'auto']}
            tick={{fill: '#71717a', fontSize: 12}}
            tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="Liquidity" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded shadow-xl">
                    <p className="font-bold text-white mb-1">{data.name}</p>
                    <p className="text-xs text-zinc-400">Cap: ${(data.x).toLocaleString()}</p>
                    <p className="text-xs text-zinc-400">Vol: ${(data.y).toLocaleString()}</p>
                    <p className="text-xs text-zinc-400">Liq: ${(data.z).toLocaleString()}</p>
                    <p className={`text-xs mt-1 ${data.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {data.priceChange.toFixed(2)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Tokens" data={data} fill="#8884d8" shape="circle">
            {data.map((entry, index) => (
                <circle 
                    key={`cell-${index}`} 
                    cx={0} 
                    cy={0} 
                    r={entry.z} 
                    className="animate-pulse"
                    fill={entry.priceChange >= 0 ? '#34d399' : '#f87171'} 
                    strokeWidth={1}
                    fillOpacity={0.6}
                    stroke={entry.priceChange >= 0 ? '#10b981' : '#ef4444'}
                />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};