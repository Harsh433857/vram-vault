import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { DESK_SHOWCASE_ITEMS } from '../data/showcase';
import { cn } from '../lib/utils';
import { X, Camera, Eye, Sparkles } from 'lucide-react';

export const DeskShowcaseModal: React.FC = () => {
  // Added 'products' to the destructuring
  const { isDeskShowcaseOpen, closeDeskShowcase, openDetailModal, selectedDeskShowcaseId, products } = useShop();

  const [activeItem, setActiveItem] = useState(
    DESK_SHOWCASE_ITEMS.find((d) => d.id === selectedDeskShowcaseId) || DESK_SHOWCASE_ITEMS[0]
  );

  if (!isDeskShowcaseOpen) return null;

  // Use 'products' instead of 'GPU_PRODUCTS'
  const linkedCard = products.find((p) => p.id === activeItem.cardId) || products[0];

  // Safety check
  if (!linkedCard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.2)] overflow-hidden my-auto max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Camera className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Real Battlestations & Previews</h2>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">15 LIVE BUILDS</span>
            </div>
          </div>
          <button onClick={closeDeskShowcase} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/40 p-5 sm:p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="lg:col-span-7 aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative group border border-slate-800 shadow-2xl">
              <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-purple-400 border border-purple-500/30 flex items-center gap-2 shadow-lg">
                <Sparkles className="w-3 h-3" />{activeItem.lightingTheme}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 relative z-10">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold tracking-widest">Setup Spotlight</span>
                <h3 className="text-2xl font-black text-white mt-1 leading-tight">{activeItem.title}</h3>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{activeItem.setupDescription}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/50 space-y-3 backdrop-blur-md shadow-lg">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Installed Hardware</span>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 p-1.5 shrink-0">
                    <img src={linkedCard.mainImage} alt={linkedCard.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{linkedCard.name}</h4>
                    <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">${linkedCard.price.toFixed(2)} • {linkedCard.vramGB}GB {linkedCard.vramType}</p>
                  </div>
                </div>
                <button onClick={() => { closeDeskShowcase(); openDetailModal(linkedCard); }} className="w-full mt-2 py-2.5 bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /><span>Inspect Card Specs & FPS</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-slate-500 border-l-2 border-slate-700 pl-2">Browse All Desk Installations ({DESK_SHOWCASE_ITEMS.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {DESK_SHOWCASE_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setActiveItem(item)} className={cn("relative aspect-[16/10] rounded-xl overflow-hidden border transition-all text-left group", activeItem.id === item.id ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02] z-10' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600')}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white truncate drop-shadow-md">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};