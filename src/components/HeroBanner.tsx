import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { DESK_SHOWCASE_ITEMS } from '../data/showcase';
import { GPUVideoBackground } from './GPUVideoBackground';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  // Added 'products' to the destructuring
  const { openDetailModal, openDeskShowcase, products } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const showcaseSlides = DESK_SHOWCASE_ITEMS.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [showcaseSlides.length]);

  const slide = showcaseSlides[currentSlide];
  
  // Use 'products' instead of 'GPU_PRODUCTS'
  const linkedCard = products.find((p) => p.id === slide.cardId) || products[0];

  // Safety check if products haven't loaded yet
  if (!linkedCard) return null;

  return (
    <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/60 py-12 lg:py-20">
      <GPUVideoBackground />

      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none -z-0 animate-float" />
      <div className="absolute bottom-10 right-10 w-[25rem] h-[25rem] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none -z-0 animate-float" style={{ animationDelay: '3s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>CUSTOM ARCHITECTURE & HARDWARE SHOWCASE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
              Unleash Peak <br />
              <span className="animate-gradient-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400">
                Visual Bandwidth
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Explore dynamic custom graphic cards ranging from budget <span className="text-cyan-400 font-bold">4–8GB</span> esports units up to monstrous <span className="text-cyan-400 font-bold">48GB</span> AI compute titans.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:border-cyan-500 transition-all">
                <Zap className="w-4 h-4 text-cyan-400" /><span>Up to 48GB VRAM</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:border-emerald-500 transition-all">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /><span>384-Bit Bus</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:border-purple-500 transition-all col-span-2 sm:col-span-1">
                <Check className="w-4 h-4 text-purple-400" /><span>0dB Tuning</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-shimmer px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:-translate-y-1 transition-all flex items-center gap-2">
                <span>Browse GPU Catalog</span><ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => openDeskShowcase()} className="px-6 py-3.5 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm border border-slate-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" /><span>View Desk Battlestations</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_50px_-10px_rgba(6,182,212,0.5)] hover:-translate-y-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />REAL SETUP SPOTLIGHT
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setCurrentSlide((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length)} className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length)} className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                  {showcaseSlides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]' : 'w-2 bg-slate-600'}`} />
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-3 bg-gradient-to-b from-slate-900/90 to-slate-950">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{slide.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{slide.setupDescription}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300">Equipped: <strong className="text-white">{slide.featuredCardName}</strong></span>
                  </div>
                  <button onClick={() => openDetailModal(linkedCard)} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};