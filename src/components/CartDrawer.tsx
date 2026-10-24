import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { cn } from '../lib/utils';
import { 
  X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart, cartTotal, cartItemCount, removeFromCart, updateCartQuantity,
    clearCart, isCartOpen, setIsCartOpen, setIsCheckoutOpen, showToast,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : 25;
  const discountAmount = appliedDiscount ? (cartTotal * appliedDiscount.percent) / 100 : 0;
  const taxAmount = (cartTotal - discountAmount) * 0.08;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost + taxAmount);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'VRAM10' || clean === 'GPU10') {
      setAppliedDiscount({ code: clean, percent: 10 });
      showToast('Coupon "VRAM10" applied: 10% OFF!', 'success');
    } else if (clean === 'TITAN20') {
      setAppliedDiscount({ code: clean, percent: 20 });
      showToast('VIP Titan Coupon applied: 20% OFF!', 'success');
    } else {
      showToast('Invalid promo code. Try "VRAM10"', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0A0D14]/95 border-l border-slate-700/80 h-full flex flex-col justify-between shadow-[-20px_0_50px_-10px_rgba(6,182,212,0.15)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white">Your Hardware Cart</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {cartItemCount} ITEMS
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button onClick={clearCart} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors" title="Clear cart">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-4 bg-slate-900/50 border-b border-slate-800/80 text-xs font-mono relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Free Insured Shipping</span>
            </span>
            <span className={cn("font-bold", cartTotal >= FREE_SHIPPING_THRESHOLD ? "text-emerald-400" : "text-cyan-400")}>
              {cartTotal >= FREE_SHIPPING_THRESHOLD ? 'UNLOCKED' : `$${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(0)} away`}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar relative z-10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shadow-inner">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Your Cart is Empty</h3>
                <p className="text-xs text-slate-400 max-w-[250px] mx-auto">
                  Explore our custom 4GB to 48GB graphics card lineup and add your powerhouse hardware!
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all"
              >
                Browse GPU Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="group p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex gap-4 items-center hover:border-cyan-500/30 transition-all">
                <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 p-2 shrink-0 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={item.product.mainImage} alt={item.product.name} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {item.product.vramGB}GB {item.product.vramType}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate mt-1">{item.product.name}</h4>
                  <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">${item.product.price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4 relative z-10">
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1 group">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code (try VRAM10)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase font-mono transition-all"
                />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all">
                Apply
              </button>
            </form>

            <div className="space-y-2 text-xs font-mono bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">${cartTotal.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Insured Freight</span>
                <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-slate-700/80 mt-2">
                <span>Total Amount</span>
                <span className="text-cyan-400 text-lg font-black drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
              className="group/btn relative w-full overflow-hidden py-4 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              <span>Proceed to Fast Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>3-Year Warranty & 30-Day Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};