import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { 
  X, CheckCircle2, Truck, CreditCard, ShieldCheck, Package, ArrowRight, ArrowLeft, Loader2 
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, clearCart, showToast } = useShop();
  const { user, isAuthenticated, setIsOrdersModalOpen } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: 'Alex Vance',
    email: 'alex.vance@custompc.io',
    address: '742 Cyberpunk Ave, Suite 101',
    city: 'Neo Tokyo',
    zip: '78701',
    country: 'United States',
    paymentMethod: 'Credit / Debit Card',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
  });

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        address: user.shippingAddress?.address || prev.address,
        city: user.shippingAddress?.city || prev.city,
        zip: user.shippingAddress?.zip || prev.zip,
        country: user.shippingAddress?.country || prev.country,
      }));
    }
  }, [user]);

  const [orderNumber, setOrderNumber] = useState('');

  if (!isCheckoutOpen) return null;

  const tax = cartTotal * 0.08;
  const shipping = cartTotal >= 500 ? 0 : 25;
  const total = cartTotal + tax + shipping;

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.address || !formData.city) {
        setError('Please fill in all shipping details before proceeding.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      try {
        // Real Purchasing API Call to backend and MongoDB Atlas
        const payload = {
          orderItems: cart.map((item) => ({
            productId: item.product.id || (item.product as any)._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            mainImage: item.product.mainImage,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          subtotal: cartTotal,
          taxPrice: tax,
          shippingPrice: shipping,
          totalAmount: total,
        };

        const createdOrder = await api.createOrder(payload);
        setOrderNumber(createdOrder.orderNumber || `VRM-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep(3);
        clearCart();
        showToast('Order placed successfully!', 'success');

        // Confetti Celebration
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#A855F7', '#10B981', '#38BDF8'],
        });
      } catch (err: any) {
        setError(err.message || 'Payment processing failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setError(null);
  };

  const inputClasses = "w-full p-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-slate-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)] overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Steps */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <span>Secure Hardware Checkout</span>
            </h2>
            
            {/* Dynamic Step Tracker */}
            <div className="flex items-center gap-3 mt-3 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className={cn("px-2 py-1 rounded-md transition-colors", step >= 1 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 bg-slate-900/50')}>
                1. Shipping
              </span>
              <span className="text-slate-600">→</span>
              <span className={cn("px-2 py-1 rounded-md transition-colors", step >= 2 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 bg-slate-900/50')}>
                2. Payment
              </span>
              <span className="text-slate-600">→</span>
              <span className={cn("px-2 py-1 rounded-md transition-colors", step === 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 bg-slate-900/50')}>
                3. Confirmation
              </span>
            </div>
          </div>

          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-400">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">City / District</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Postal / Zip Code</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Shipping Method Note */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-3">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">Insured Freight Priority: </span>
                  Signature required upon courier delivery. Anti-static packaging guaranteed.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Simulated Card Payment Gateway
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    256-Bit SSL
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-slate-400">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-400">Expires</label>
                      <input
                        type="text"
                        value={formData.expDate}
                        onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-400">CVC / CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Hardware Subtotal ({cart.length} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Insured Express Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-cyan-400 font-black">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Purchase Confirmed!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your graphics hardware order has been stored in MongoDB Atlas and sent to fulfillment dispatch.
                </p>
                <div className="inline-block mt-3 px-4 py-2 bg-slate-900 border border-cyan-500/40 rounded-xl font-mono text-sm font-black text-cyan-400 tracking-wider">
                  Order ID: {orderNumber}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {isAuthenticated && (
                  <button
                    onClick={() => { handleClose(); setIsOrdersModalOpen(true); }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold rounded-xl border border-slate-700 transition-colors"
                  >
                    View My Orders
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs rounded-xl shadow-glow-cyan"
                >
                  Return to Store
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step < 3 && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            {step === 2 ? (
              <button
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shipping
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting || cart.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transacting Order...</span>
                </>
              ) : step === 1 ? (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Authorize & Complete Purchase (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
