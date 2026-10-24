import React from 'react';
import { useShop } from '../context/ShopContext';

import { cn } from '../lib/utils';
import { 
  X, Trash2, ShoppingCart, Layers, Plus, Star, Zap 
} from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen, addToCart, toggleCompare,products,
  } = useShop();

  if (!isCompareOpen) return null;

const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-6xl bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)] overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Hardware Matrix Comparison</h2>
              <span className="text-xs font-mono text-slate-400">
                {comparedProducts.length} / 3 Slots Filled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button onClick={clearCompare} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold transition-all">
                <Trash2 className="w-4 h-4" />
                <span>Clear Matrix</span>
              </button>
            )}
            <button onClick={() => setIsCompareOpen(false)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-500 shadow-inner">
                <Layers className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">No Graphics Cards Selected</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                  Select any card from the catalog and click the compare icon to inspect side-by-side specs, memory bandwidth, and FPS benchmarks.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="pt-4 max-w-xl mx-auto">
                <span className="text-xs font-mono uppercase text-slate-500 block mb-3 tracking-widest">Quick Add Flagships:</span>
                <div className="flex flex-wrap justify-center gap-3">
                  {products.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => toggleCompare(p.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-slate-300 flex items-center gap-2 transition-colors group"
                    >
                      <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
                      <span>{p.name.split(' ')[0]} {p.vramGB}GB</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Top Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="relative group p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 flex flex-col justify-between gap-4 hover:border-cyan-500/40 transition-all shadow-lg">
                    <button onClick={() => removeFromCompare(p.id)} className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors z-20">
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image Container with Glow */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center p-4">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <img src={p.mainImage} alt={p.name} className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{p.code}</span>
                      <h4 className="text-base font-bold text-white truncate mt-1">{p.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xl font-black text-white font-mono">${p.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-white">{p.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
                
                {/* Empty Slots to fill the grid */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <div key={i} className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center min-h-[300px] text-slate-600">
                    <Plus className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-mono uppercase tracking-widest">Empty Slot</span>
                  </div>
                ))}
              </div>

              {/* Side-by-side Specifications Table */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden text-xs font-mono shadow-xl">
                
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-slate-950/80 p-4 font-bold text-slate-400 border-b border-slate-800 items-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Specification</span>
                  {comparedProducts.map((p) => (
                    <span key={p.id} className="text-white truncate pr-2 border-l border-slate-800/80 pl-4">{p.name}</span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-slate-700 italic border-l border-slate-800/80 pl-4">Waiting...</span>
                  ))}
                </div>

                {/* Rows */}
                {[
                  { label: 'VRAM Buffer', key: 'vram', render: (p: any) => <span className="text-cyan-400 font-bold text-sm bg-cyan-500/10 px-2 py-0.5 rounded">{p.vramGB} GB {p.vramType}</span> },
                  { label: 'Memory Bus', key: 'bus', render: (p: any) => <span className="text-slate-200 font-bold">{p.busWidth}</span> },
                  { label: 'Boost Clock', key: 'boost', render: (p: any) => <span className="text-slate-200">{p.boostClock} MHz</span> },
                  { label: 'Stream Cores', key: 'cores', render: (p: any) => <span className="text-slate-200">{p.cores.toLocaleString()}</span> },
                  { label: 'TDP Power', key: 'tdp', render: (p: any) => <span className="text-slate-200">{p.tdpWatts} Watts</span> },
                  { label: 'Rec. PSU', key: 'psu', render: (p: any) => <span className="text-amber-400 font-bold">{p.recommendedPsu} Watts</span> },
                  { label: 'Cooling Type', key: 'cooling', render: (p: any) => <span className="text-slate-200">{p.cooling}</span> },
                  { label: 'Dimensions', key: 'dims', render: (p: any) => <span className="text-slate-200">{p.lengthMm}mm ({p.slots} slots)</span> },
                ].map((row, idx) => (
                  <div key={row.key} className={cn("grid grid-cols-4 p-4 items-center hover:bg-slate-800/30 transition-colors", idx !== 7 && "border-b border-slate-800/60")}>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-sans font-semibold">{row.label}</span>
                    {comparedProducts.map((p) => (
                      <div key={p.id} className="border-l border-slate-800/60 pl-4">
                        {row.render(p)}
                      </div>
                    ))}
                    {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                      <span key={i} className="text-slate-800 border-l border-slate-800/60 pl-4">-</span>
                    ))}
                  </div>
                ))}

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};