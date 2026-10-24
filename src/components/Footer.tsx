import React from 'react';
import { useShop } from '../context/ShopContext';
import { Cpu, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setFilter } = useShop();

  return (
    <footer className="relative bg-[#07090E] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs font-sans overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-20 pointer-events-none" />
      
      {/* Glow at the top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Value Highlights (Holographic Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-800/80">
          
          <div className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all cursor-default">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              <Truck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">Insured Courier</h4>
              <p className="text-[11px] text-slate-400">Anti-static foam transit</p>
            </div>
          </div>

          <div className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all cursor-default">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              <ShieldCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">3-Year Warranty</h4>
              <p className="text-[11px] text-slate-400">Full silicon replacement</p>
            </div>
          </div>

          <div className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all cursor-default">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
              <Zap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">100% Tested</h4>
              <p className="text-[11px] text-slate-400">24-hr FurMark burn-in</p>
            </div>
          </div>

          <div className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all cursor-default">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
              <RotateCcw className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">30-Day Returns</h4>
              <p className="text-[11px] text-slate-400">Zero restocking fees</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setFilter('category', 'all')}>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Cpu className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-mono font-extrabold text-base text-white tracking-wider group-hover:text-cyan-400 transition-colors">VRAM VAULT</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Custom enthusiast graphics card marketplace offering elite cooling architectures, factory binning, and real setup previews.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2">VRAM Tiers</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setFilter('category', '4-8 vram')} className="group flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                  4 - 8 GB VRAM (Esports)
                </button>
              </li>
              <li>
                <button onClick={() => setFilter('category', '8-12 vram')} className="group flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                  8 - 12 GB VRAM (1440p)
                </button>
              </li>
              <li>
                <button onClick={() => setFilter('category', '16-24 vram')} className="group flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                  16 - 24 GB VRAM (4K)
                </button>
              </li>
              <li>
                <button onClick={() => setFilter('category', '24 and above vram')} className="group flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                  24+ GB VRAM (Titan & AI)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-purple-500 pl-2">Hardware Tools</h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors">Multi-Angle Inspection</span></li>
              <li><span className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors">Real-Time FPS Simulator</span></li>
              <li><span className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors">Side-by-Side Compare</span></li>
              <li><span className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors">PSU Wattage Estimator</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">Newsletter</h4>
            <p className="text-slate-400 mb-3">Get notified about low-stock drops and exclusive discounts.</p>
            <div className="flex gap-2 group">
              <input
                type="email"
                placeholder="developer@pc.io"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>© 2026 VRAM VAULT // Custom Graphics Card Marketplace.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-cyan-400">React</span>, <span className="text-blue-400">TypeScript</span> & <span className="text-cyan-300">Tailwind</span>
          </p>
        </div>

      </div>
    </footer>
  );
};