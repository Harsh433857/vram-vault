import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { cn } from '../lib/utils';
import { X, Gauge, Zap, ChevronDown } from 'lucide-react';

export const PSUCalculatorModal: React.FC = () => {
  // 1. Get products from context, and REMOVE the GPU_PRODUCTS import
  const { isPSUCalculatorOpen, setIsPSUCalculatorOpen, products } = useShop();

  // 2. ALL useState hooks MUST come first
  const [selectedGpuId, setSelectedGpuId] = useState<string>('');
  const [cpuType, setCpuType] = useState<'i5' | 'i7' | 'i9' | 'threadripper'>('i7');
  const [coolerType, setCoolerType] = useState<'air' | 'aio'>('aio');
  const [drivesCount, setDrivesCount] = useState(2);
  const [fansCount, setFansCount] = useState(6);
  const [overclocking, setOverclocking] = useState(true);

  // 3. Only AFTER hooks, we can do early returns
  if (!isPSUCalculatorOpen || products.length === 0) return null;

  // 4. Use products instead of GPU_PRODUCTS
  const currentGpu = products.find((p) => p.id === selectedGpuId) || products[0];

  const cpuWatts = { i5: 125, i7: 180, i9: 250, threadripper: 350 }[cpuType];
  const gpuWatts = currentGpu.tdpWatts;
  const motherboardWatts = 60;
  const coolerWatts = coolerType === 'aio' ? 35 : 15;
  const storageWatts = drivesCount * 10;
  const fanWatts = fansCount * 5;
  const ocWatts = overclocking ? 50 : 0;

  const totalCalculatedWatts = cpuWatts + gpuWatts + motherboardWatts + coolerWatts + storageWatts + fanWatts + ocWatts;
  const recommendedPsuRating = Math.ceil((totalCalculatedWatts * 1.3) / 50) * 50;

  const rangeClasses = "w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.6)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(245,158,11,0.15)] overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Gauge className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">System PSU Estimator</h2>
              <p className="text-xs text-slate-400">Calculate your peak system power draw.</p>
            </div>
          </div>
          <button onClick={() => setIsPSUCalculatorOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* GPU Picker */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">1. Select Graphics Card</label>
            <div className="relative group/select">
              <select
                value={selectedGpuId || currentGpu.id}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full appearance-none p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
              >
                {/* 5. Use products.map instead of GPU_PRODUCTS.map */}
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.vramGB}GB - TDP {p.tdpWatts}W)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover/select:text-amber-400 transition-colors" />
            </div>
          </div>

          {/* CPU Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">2. Processor (CPU) Class</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'i5', label: 'i5 / R5', watts: 125 },
                { id: 'i7', label: 'i7 / R7', watts: 180 },
                { id: 'i9', label: 'i9 / R9', watts: 250 },
                { id: 'threadripper', label: 'Threadripper', watts: 350 },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCpuType(c.id as any)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1",
                    cpuType === c.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'
                  )}
                >
                  <span className="text-xs font-bold">{c.label}</span>
                  <span className="text-[10px] font-mono opacity-70">{c.watts}W</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Sliders & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">Cooling</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button onClick={() => setCoolerType('air')} className={cn("flex-1 py-1.5 rounded-md text-xs font-bold transition-all", coolerType === 'air' ? 'bg-slate-800 text-white' : 'text-slate-500')}>Air</button>
                <button onClick={() => setCoolerType('aio')} className={cn("flex-1 py-1.5 rounded-md text-xs font-bold transition-all", coolerType === 'aio' ? 'bg-slate-800 text-white' : 'text-slate-500')}>AIO</button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">SSD Drives</span>
                <span className="text-xs font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{drivesCount}</span>
              </div>
              <input type="range" min="1" max="6" value={drivesCount} onChange={(e) => setDrivesCount(Number(e.target.value))} className={rangeClasses} />
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Case Fans</span>
                <span className="text-xs font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{fansCount}</span>
              </div>
              <input type="range" min="2" max="12" value={fansCount} onChange={(e) => setFansCount(Number(e.target.value))} className={rangeClasses} />
            </div>
          </div>

          {/* Overclocking Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
             <div className="flex items-center gap-2">
               <Zap className="w-4 h-4 text-rose-400" />
               <span className="text-xs font-bold text-slate-300">Enable CPU/GPU Overclocking (+50W headroom)</span>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={overclocking} onChange={() => setOverclocking(!overclocking)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Results Display */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-2xl pointer-events-none rounded-2xl" />

            <div className="relative z-10 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Peak System Power Draw</span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start mt-1">
                <span className="text-3xl font-black font-mono text-white">{totalCalculatedWatts}W</span>
                <span className="text-[10px] text-slate-500 font-mono">MAX LOAD</span>
              </div>
            </div>

            <div className="hidden sm:block h-12 w-[1px] bg-slate-800" />

            <div className="relative z-10 text-center sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Recommended PSU</span>
              <div className="text-4xl font-black font-mono text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] mt-1">
                {recommendedPsuRating}W
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => setIsPSUCalculatorOpen(false)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
};