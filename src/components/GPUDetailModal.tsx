import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { cn } from '../lib/utils';
import { 
  X, ShoppingCart, Heart, Layers, Star, ShieldCheck, 
  Zap, CheckCircle2, Monitor, Cpu, Plus, Minus 
} from 'lucide-react';

export const GPUDetailModal: React.FC = () => {
  const {
    activeModalProduct, closeDetailModal, addToCart, toggleWishlist, isInWishlist,
    toggleCompare, isInCompare, setIsCartOpen,
  } = useShop();

  const [activeAngle, setActiveAngle] = useState<'main' | 'desk' | 'back' | 'ports' | 'fan'>('main');
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState<'1080p' | '1440p' | '4k'>('1440p');
  const [rtEnabled, setRtEnabled] = useState(false);
  const [frameGenEnabled, setFrameGenEnabled] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!activeModalProduct) return null;

  const product = activeModalProduct;
  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const angleOptions = [
    { id: 'main', label: 'Front Shroud', image: product.mainImage },
    { id: 'desk', label: 'Desk Setup', image: product.deskImage || product.mainImage },
    { id: 'back', label: 'Backplate', image: product.backImage || product.mainImage },
    { id: 'ports', label: 'I/O Ports', image: product.portsImage || product.mainImage },
    { id: 'fan', label: 'Fan System', image: product.fanImage || product.mainImage },
  ];

  const currentAngleImage = angleOptions.find((a) => a.id === activeAngle)?.image || product.mainImage;
  const currentGame = product.benchmarks[selectedGameIndex] || product.benchmarks[0];
  
  let baseFps = selectedResolution === '1080p' ? currentGame.fps1080p : selectedResolution === '1440p' ? currentGame.fps1440p : currentGame.fps4k;
  if (rtEnabled) baseFps = Math.round(baseFps * 0.75);
  if (frameGenEnabled) baseFps = Math.round(baseFps * 1.55);

  const handleAddToCartAndOpen = () => {
    addToCart(product, quantity);
    closeDetailModal();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container with Glowing Border */}
      <div 
        className="relative w-full max-w-6xl bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)] overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              {product.code}
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md sm:max-w-lg">{product.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(product.id)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                isCompared 
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              )}
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                isFavorited 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' 
                  : 'bg-slate-800 text-slate-400 hover:text-rose-400 border-slate-700'
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorited && "fill-rose-500")} />
            </button>

            <button
              onClick={closeDetailModal}
              className="p-2 ml-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Image Viewer */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/50 overflow-hidden flex items-center justify-center p-6 shadow-inner group">
                
                {/* Ambient pulse behind image */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent animate-pulse pointer-events-none" />

                <img
                  src={currentAngleImage}
                  alt={product.name}
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono font-bold text-cyan-400 z-20">
                  {angleOptions.find((a) => a.id === activeAngle)?.label.toUpperCase()}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {angleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setActiveAngle(opt.id as any)}
                    className={cn(
                      "relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all group/thumb",
                      activeAngle === opt.id
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-600 opacity-70 hover:opacity-100'
                    )}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900">
                      <img src={opt.image} alt={opt.label} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" />
                    </div>
                    <span className={cn("text-[10px] font-mono font-bold truncate", activeAngle === opt.id ? "text-cyan-400" : "text-slate-400")}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-sm text-slate-300 italic bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                "{product.tagline}"
              </p>
            </div>

            {/* Right: Pricing & Specs */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-xs">({product.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    IN STOCK ({product.stockUnits} UNITS)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white tracking-tight">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className="px-2 py-1 rounded-md text-[11px] font-mono font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SAVE ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>

              {/* Quantity & Cart Action */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockUnits, q + 1))}
                    className="p-2.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCartAndOpen}
                  className="flex-1 group/btn relative overflow-hidden py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now & Open Cart (${(product.price * quantity).toFixed(2)})</span>
                </button>
              </div>

              {/* Specs Grid */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Engineering Specifications</span>
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">VRAM:</span>
                    <span className="text-white font-bold">{product.vramGB}GB {product.vramType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Bus Width:</span>
                    <span className="text-white font-bold">{product.busWidth}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Boost Clock:</span>
                    <span className="text-cyan-400 font-bold">{product.boostClock} MHz</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Stream Cores:</span>
                    <span className="text-white font-bold">{product.cores.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">TDP Power:</span>
                    <span className="text-white font-bold">{product.tdpWatts}W</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Rec. PSU:</span>
                    <span className="text-amber-400 font-bold">{product.recommendedPsu}W</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* FPS Simulator */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  <span>Real-Time Benchmark Simulator</span>
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                {(['1080p', '1440p', '4k'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setSelectedResolution(res)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all",
                      selectedResolution === res
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.benchmarks.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedGameIndex(idx)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    selectedGameIndex === idx
                      ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  )}
                >
                  <p className={cn("text-xs font-bold truncate", selectedGameIndex === idx ? 'text-white' : 'text-slate-400')}>{b.game.split('(')[0]}</p>
                  <span className={cn("text-[10px] font-mono", selectedGameIndex === idx ? 'text-cyan-400' : 'text-slate-500')}>Max / High Preset</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80">
              <div className="lg:col-span-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setRtEnabled(!rtEnabled)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2",
                    rtEnabled
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                  )}
                >
                  <Zap className="w-4 h-4" />
                  <span>Ray Tracing: {rtEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setFrameGenEnabled(!frameGenEnabled)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2",
                    frameGenEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                  )}
                >
                  <Zap className="w-4 h-4" />
                  <span>AI Frame Gen: {frameGenEnabled ? 'ACTIVE' : 'OFF'}</span>
                </button>
              </div>

              {/* Animated FPS Bar */}
              <div className="lg:col-span-5 flex items-center justify-between lg:justify-end gap-6">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Projected Average</span>
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-4xl font-black font-mono text-cyan-400 tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      {baseFps}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-300">FPS</span>
                  </div>
                </div>

                {/* The bar */}
                <div className="h-14 w-3 rounded-full overflow-hidden bg-slate-800 flex flex-col justify-end shadow-inner">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    style={{ height: `${Math.min(100, (baseFps / 240) * 100)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};