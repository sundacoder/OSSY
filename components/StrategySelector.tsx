import React from 'react';
import { STRATEGIES } from '../constants';
import { StrategyType } from '../types';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

interface Props {
  selected?: StrategyType | null;
  onSelect: (id: StrategyType) => void;
  disabled?: boolean;
}

export const StrategySelector: React.FC<Props> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {STRATEGIES.map((strategy) => {
        const Icon = strategy.icon;
        const isSelected = selected === strategy.id;

        return (
          <button
            key={strategy.id}
            onClick={() => onSelect(strategy.id)}
            disabled={disabled}
            className={clsx(
              "relative group overflow-hidden rounded-xl border p-6 transition-all duration-300 text-left",
              "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090b] focus:ring-zinc-600",
              isSelected 
                ? `${strategy.borderColor} bg-gradient-to-br ${strategy.bgGradient} shadow-lg shadow-${strategy.color.split('-')[1]}-900/20`
                : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900",
              disabled && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={clsx(
                "p-3 rounded-lg bg-zinc-950/50 border border-zinc-800",
                strategy.color
              )}>
                <Icon size={24} />
              </div>
              {isSelected && (
                 <span className="flex items-center text-xs font-mono text-zinc-400">
                    Active <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{strategy.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {strategy.description}
            </p>

            <div className={clsx(
              "mt-6 flex items-center text-sm font-medium transition-colors",
              isSelected ? "text-white" : "text-zinc-500 group-hover:text-white"
            )}>
              Deploy Agent <ChevronRight size={16} className="ml-1" />
            </div>
            
            {/* Background Glow Effect */}
            <div className={clsx(
              "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] transition-opacity opacity-0 group-hover:opacity-20 pointer-events-none",
              isSelected ? "opacity-30" : "",
              strategy.color.replace('text', 'bg')
            )} />
          </button>
        );
      })}
    </div>
  );
};