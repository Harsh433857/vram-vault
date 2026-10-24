import React from 'react';
import { useShop } from '../context/ShopContext';
import { cn } from '../lib/utils';
import { Layers, Zap, Cpu, Flame, Crown, Camera } from 'lucide-react';

export const CategoryTabs: React.FC = () => {
  // 1. Get 'products' from the context instead of importing GPU_PRODUCTS
  const { filters, setFilter, openDeskShowcase, products } = useShop();

  // 2. Calculate categories dynamically based on the fetched products
  const categories = [
    { id: 'all', label: 'All Lineup', vramBadge: 'ALL', icon: Layers, count: products.length, activeColor: 'text-cyan-400', borderColor: 'border-cyan-500', glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]', bgColor: 'bg-cyan-500/10' },
    { id: '4-8 vram', label: '4 – 8 GB VRAM', vramBadge: '1080P', icon: Zap, count: products.filter((p) => p.category === '4-8 vram').length, activeColor: 'text-emerald-400', borderColor: 'border-emerald-500', glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', bgColor: 'bg-emerald-500/10' },
    { id: '8-12 vram', label: '8 – 12 GB VRAM', vramBadge: '1440P', icon: Cpu, count: products.filter((p) => p.category === '8-12 vram').length, activeColor: 'text-sky-400', borderColor: 'border-sky-500', glowColor: 'shadow-[0_0_20px_rgba(14,165,233,0.3)]', bgColor: 'bg-sky-500/10' },
    { id: '16-24 vram', label: '16 – 24 GB VRAM', vramBadge: '4K ULTRA', icon: Flame, count: products.filter((p) => p.category === '16-24 vram').length, activeColor: 'text-purple-400', borderColor: 'border-purple-500', glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', bgColor: 'bg-purple-500/10' },
    { id: '24 and above vram', label: '24+ GB VRAM Titan', vramBadge: 'TITAN / AI', icon: Crown, count: products.filter((p) => p.category === '24 and above vram').length, activeColor: 'text-amber-400', borderColor: 'border-amber-500', glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', bgColor: 'bg-amber-500/10' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-slate-800/80">
        
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = filters.category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setFilter('category', cat.id)}
                className={cn(
                  "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-300 whitespace-nowrap border backdrop-blur-md overflow-hidden",
                  isActive
                    ? `${cat.bgColor} ${cat.borderColor} ${cat.activeColor} ${cat.glowColor} scale-105`
                    : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800/80"
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <span className={cn("absolute bottom-0 left-0 w-full h-[2px]", cat.activeColor.replace('text-', 'bg-'))} />
                )}

                <Icon className={cn(
                  "w-4 h-4 transition-transform duration-300 group-hover:scale-110", 
                  isActive ? cat.activeColor : "text-slate-400 group-hover:text-slate-300"
                )} />
                
                <span className="font-bold">{cat.label}</span>
                
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors",
                  isActive
                    ? `${cat.bgColor} ${cat.activeColor} border ${cat.borderColor}/50`
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                )}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desk Battlestations Pill Trigger */}
        <button
          onClick={() => openDeskShowcase()}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/50 text-purple-300 hover:text-white hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 ml-auto overflow-hidden"
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-purple-400/20 to-transparent skew-x-12" />
          
          <Camera className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span>Real Desk Gallery (15)</span>
        </button>

      </div>
    </div>
  );
};