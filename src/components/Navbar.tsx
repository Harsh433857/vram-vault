import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils'; 
import { 
  Cpu, 
  Search, 
  ShoppingCart, 
  Heart, 
  Layers, 
  Gauge, 
  Camera, 
  X, 
  Menu,
  User as UserIcon,
  LogOut,
  PackageCheck,
  Shield,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    filters,
    setFilter,
    cartItemCount,
    cartTotal,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsCompareOpen,
    setIsPSUCalculatorOpen,
    openDeskShowcase,
  } = useShop();

  const {
    user,
    isAuthenticated,
    isAdmin,
    openLogin,
    logout,
    setIsOrdersModalOpen,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 border-b",
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-2xl border-cyan-500/20 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.15)]" 
          : "bg-slate-950/40 backdrop-blur-xl border-slate-800/50"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500",
        isScrolled ? "h-16" : "h-20"
      )}>
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer group" 
            onClick={() => { setFilter('category', 'all'); setFilter('search', ''); }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-[1.5px] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                <div className="w-full h-full bg-[#0A0D14] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="absolute -inset-1 bg-cyan-500/20 rounded-xl blur-lg -z-10 group-hover:bg-cyan-500/40 transition-all" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">VRAM</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">VAULT</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">CUSTOM GPU MARKETPLACE</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block group">
            <div className={cn(
              "relative transition-all duration-300 rounded-xl",
              searchFocused ? "scale-[1.02] shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)]" : ""
            )}>
              <div className={cn(
                "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors",
                searchFocused ? "text-cyan-400" : "text-slate-400"
              )}>
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search models, VRAM (e.g. 24GB), triple fan, vapor..."
                className={cn(
                  "w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder-slate-400 transition-all font-sans outline-none",
                  searchFocused 
                    ? "border-cyan-500 bg-slate-900" 
                    : "border-slate-700/80 hover:border-slate-600"
                )}
              />
              {filters.search && (
                <button
                  onClick={() => setFilter('search', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Links & Buttons */}
          <div className="flex items-center gap-2 lg:gap-3">
            
            {/* Desk Showcase Trigger */}
            <button
              onClick={() => openDeskShowcase()}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Desk Setups</span>
            </button>

            {/* PSU Calculator Trigger */}
            <button
              onClick={() => setIsPSUCalculatorOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/40 transition-all"
            >
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>PSU Checker</span>
            </button>

            {/* Compare Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className={cn(
                "relative p-2.5 rounded-xl border transition-all group",
                compareList.length > 0 
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                  : "border-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 hover:border-cyan-500/30"
              )}
              title="Compare Selected GPUs"
            >
              <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-glow-cyan animate-pulse border border-slate-950">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (wishlist.length === 0) {
                  alert('Your favorites list is currently empty. Click the heart icon on any GPU to save it!');
                } else {
                  setFilter('search', '');
                }
              }}
              className={cn(
                "relative p-2.5 rounded-xl border transition-all group",
                wishlist.length > 0
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "border-slate-800/80 text-slate-300 hover:text-rose-400 hover:bg-slate-800/60 hover:border-rose-500/30"
              )}
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.5)] border border-slate-950">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative overflow-hidden flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.03] active:scale-[0.97]"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              <ShoppingCart className="w-5 h-5 text-slate-950" />
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-900/70">Cart</span>
                <span className="text-xs font-black tracking-tight text-slate-950">${cartTotal.toFixed(2)}</span>
              </div>
              {cartItemCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-cyan-400 text-[10px] font-black min-w-[20px] text-center border border-slate-800">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all text-slate-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-sky-600 text-slate-950 font-black text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col items-start text-left leading-none">
                    <span className="text-xs font-bold text-white max-w-[90px] truncate">{user.name}</span>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0A0D14] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { setIsOrdersModalOpen(true); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-cyan-400" />
                      <span>My Orders</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => { navigate('/admin'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-400 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Search & Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-3 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                placeholder="Search models, VRAM..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { openDeskShowcase(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                Desk Setups
              </button>
              <button
                onClick={() => { setIsPSUCalculatorOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
              >
                <Gauge className="w-4 h-4 text-amber-400" />
                PSU Checker
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => { setIsOrdersModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold"
                >
                  <PackageCheck className="w-4 h-4" />
                  My Orders
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { openLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs"
              >
                <UserIcon className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
