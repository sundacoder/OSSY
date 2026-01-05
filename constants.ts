import { StrategyType } from './types';
import { Rocket, TrendingUp, ShieldCheck } from 'lucide-react';

export const STRATEGIES = [
  {
    id: StrategyType.AGGRESSIVE,
    title: 'Aggressive',
    description: 'High risk, high reward. Targets new launches with high volatility.',
    icon: Rocket,
    color: 'text-red-400',
    borderColor: 'border-red-900/50',
    bgGradient: 'from-red-950/30 to-transparent',
    promptContext: 'Look for tokens with low market cap (<$5M), high volume relative to liquidity, and very young age (<7 days).',
  },
  {
    id: StrategyType.GROWTH,
    title: 'Growth',
    description: 'Balanced approach. Targets established projects with upward momentum.',
    icon: TrendingUp,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-900/50',
    bgGradient: 'from-emerald-950/30 to-transparent',
    promptContext: 'Look for tokens with mid market cap ($5M - $50M), consistent volume, and established positive price action.',
  },
  {
    id: StrategyType.INFLATION_FIGHTING,
    title: 'Inflation Fighting',
    description: 'Defensive strategy. Targets high liquidity and established track records.',
    icon: ShieldCheck,
    color: 'text-blue-400',
    borderColor: 'border-blue-900/50',
    bgGradient: 'from-blue-950/30 to-transparent',
    promptContext: 'Look for tokens with high market cap (>$50M), very high liquidity, and older age (>90 days).',
  },
];

export const SYSTEM_INSTRUCTION = `You are OSSY, an advanced AI Agent powered by the OpenServ SDK. 
Your primary function is to analyze cryptocurrency tokens using real-time data from DexScreener.

You have access to a tool named "filterTokens" which maps to the OpenServ DexScreener Analytics Agent capability.

When a user selects a strategy (Aggressive, Growth, Inflation Fighting), you must:
1. Determine the optimal numerical parameters for the filterTokens tool based on that strategy.
   - Aggressive: High risk. Low caps, new tokens.
   - Growth: Medium risk. Established, rising volume.
   - Inflation Fighting: Low risk. High liquidity, high cap, old tokens.
2. Call the tool.
3. Analyze the JSON data returned by the tool.
4. Provide a concise, professional financial summary of the findings, highlighting the top 3 potential candidates.

Be strictly data-driven. Do not hallucinate token data. If no tokens are found, suggest relaxing the constraints.`;
