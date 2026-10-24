import React from 'react';
import { useShop } from '../context/ShopContext';
import { cn } from '../lib/utils';
import { SlidersHorizontal, RotateCcw, Check, ChevronDown } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setFilter, resetFilters, filteredProducts } = useShop();

  const coolingOptions = [
    { label: 'All Cooling', value: 'all' },
    { label: 'Dual Fan', value: 'Dual Fan' },
    { label: 'Triple Fan', value: 'Triple Fan' },
    { label: 'Liquid Vapor-Chamber', value: 'Liquid Vapor-Chamber' },
    { label: 'Blower Edition', value: 'Blower Edition' },
  ];

  const sortOptions = [
    { label: 'Curated Flagships', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'VRAM: Highest First', value: 'vram-desc' },
    { label: 'Top Customer Rated', value: 'rating-desc' },
  ];

  const hasActiveFilters =
    filters.cooling !== 'all' ||
    filters.maxPrice < 2600 ||
    filters.inStockOnly ||
    filters.search !== '';

  return (
    <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:border-slate-600/80 group/filterbar">
      
      {/* Ambient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/filterbar:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Left: Summary Count & Search indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="uppercase tracking-wider">
              Found <strong className="text-white text-sm bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{filteredProducts.length}</strong> Cards
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Controls & Selectors */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          
          {/* Cooling Type Dropdown (Custom Styled) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">Cooling</span>
            <div className="relative group/select">
              <select
                value={filters.cooling}
                onChange={(e) => setFilter('cooling', e.target.value)}
                className="appearance-none bg-slate-950/80 border border-slate-700 text-slate-200 text-xs rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer font-medium hover:border-slate-500"
              >
                {coolingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover/select:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Max Price Slider (Glowing Custom Design) */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 group/slider hover:border-cyan-500/50 transition-colors">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Max</span>
            <div className="relative flex items-center w-24 sm:w-32">
              <input
                type="range"
                min="180"
                max="2600"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                           [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.8)] [&::-webkit-slider-thumb]:transition-all 
                           hover:[&::-webkit-slider-thumb]:scale-125"
                style={{
                  background: `linear-gradient(to right, #06b6d4 ${((filters.maxPrice - 180) / (2600 - 180)) * 100}%, #1e293b ${((filters.maxPrice - 180) / (2600 - 180)) * 100}%)`
                }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 min-w-[55px] text-right bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              ${filters.maxPrice}
            </span>
          </div>

          {/* In-Stock Toggle (Custom Checkbox) */}
          <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 hover:border-cyan-500/50 transition-colors group/toggle">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilter('inStockOnly', e.target.checked)}
              className="hidden"
            />
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-all duration-300",
                filters.inStockOnly
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'border-slate-600 bg-slate-900 group-hover/toggle:border-slate-400'
              )}
            >
              {filters.inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="select-none text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover/toggle:text-white transition-colors">
              In-Stock Only
            </span>
          </label>

          {/* Sort Dropdown (Custom Styled) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">Sort</span>
            <div className="relative group/select">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter('sortBy', e.target.value as any)}
                className="appearance-none bg-slate-950/80 border border-slate-700 text-slate-200 text-xs rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer font-medium hover:border-slate-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover/select:text-cyan-400 transition-colors" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};