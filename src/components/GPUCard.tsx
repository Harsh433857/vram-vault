import React from 'react';
import { GPUProduct } from '../types/gpu';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingCart, Layers, Eye, Star } from 'lucide-react';

interface GPUCardProps {
  product: GPUProduct;
}

export const GPUCard: React.FC<GPUCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    openDetailModal,
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    // 1. Outer Wrapper: Provides the hover lift and animated gradient border effect
    <div className="group relative rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)]">
      
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700/50 via-slate-800/20 to-slate-700/50 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* 2. Main Card Body: Glassmorphism */}
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[15px] bg-[#0A0D14]/90 backdrop-blur-xl z-10">
        
        {/* Card Header & Image Area */}
        <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900/50 to-transparent p-6">
          
          {/* Radial glow behind image on hover */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Floating Product Image */}
          <img
            src={product.mainImage}
            alt={product.name}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-4"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
            {product.badge && (
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-black tracking-widest uppercase border backdrop-blur-md shadow-lg ${
                  product.badge === 'FLAGSHIP'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : product.badge === 'BESTSELLER'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : product.badge === 'OVERCLOCKED'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
              >
                {product.badge}
              </span>
            )}

            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-cyan-400 shadow-lg">
              {product.vramGB}GB {product.vramType}
            </span>
          </div>

          {/* Top-Right Action Buttons (Glassmorphism) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 border ${
                isCompared
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-950/50 text-slate-400 hover:text-white border-slate-700/50 hover:bg-slate-800/80'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare this GPU'}
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 border ${
                isFavorited
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-950/50 text-slate-400 hover:text-rose-400 border-slate-700/50 hover:bg-slate-800/80'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Quick View Overlay (Slides up on hover) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-center">
            <button
              onClick={() => openDetailModal(product)}
              className="w-full py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Eye className="w-4 h-4" />
              <span>Quick Inspect</span>
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
          
          <div>
            {/* Code & Rating */}
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-cyan-400 font-bold tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">{product.code}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
                <span className="text-slate-500">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Model Name */}
            <h3
              onClick={() => openDetailModal(product)}
              className="text-lg font-bold text-white transition-colors cursor-pointer line-clamp-1 group-hover:text-cyan-300"
            >
              {product.name}
            </h3>

            {/* Tagline */}
            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {product.tagline}
            </p>

            {/* Key Specs Grid (Neon Pills) */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex flex-col items-center justify-center text-center shadow-inner group-hover:border-slate-700 transition-colors">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Bus</span>
                <span className="text-xs font-bold text-slate-200 font-mono">{product.busWidth}</span>
              </div>

              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex flex-col items-center justify-center text-center shadow-inner group-hover:border-cyan-900 transition-colors">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Boost</span>
                <span className="text-xs font-bold text-cyan-400 font-mono">{product.boostClock}MHz</span>
              </div>

              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex flex-col items-center justify-center text-center shadow-inner group-hover:border-amber-900/50 transition-colors">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">PSU</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{product.recommendedPsu}W</span>
              </div>
            </div>
          </div>

          {/* Pricing & Action Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {discountPercent > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openDetailModal(product)}
                className="py-3 px-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 text-slate-200 text-xs font-bold tracking-wide transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Details</span>
              </button>

              {/* Dynamic Add to Cart Button with Shine Effect */}
              <button
                onClick={() => addToCart(product)}
                className="group/btn relative overflow-hidden py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
              >
                {/* Shine Sweep Animation */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};