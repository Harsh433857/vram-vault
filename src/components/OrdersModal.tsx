import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Order } from '../types/order';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const OrdersModal: React.FC = () => {
  const { isOrdersModalOpen, setIsOrdersModalOpen, isAuthenticated, openLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOrdersModalOpen && isAuthenticated) {
      setLoading(true);
      setError(null);
      api.getMyOrders()
        .then((data) => setOrders(data))
        .catch((err) => setError(err.message || 'Failed to load orders'))
        .finally(() => setLoading(false));
    }
  }, [isOrdersModalOpen, isAuthenticated]);

  if (!isOrdersModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-[#0A0D14]/95 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>My Hardware Orders</span>
                {orders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
                    {orders.length}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">Real-time order tracking & invoices</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOrdersModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          {!isAuthenticated ? (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Sign In to View Orders</h3>
                <p className="text-xs text-slate-400">Please sign in to your account to review past purchases and delivery statuses.</p>
              </div>
              <button
                onClick={() => { setIsOrdersModalOpen(false); openLogin(); }}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs rounded-xl shadow-glow-cyan"
              >
                Sign In Now
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Fetching order history...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't ordered any high-performance graphics cards yet. Browse our flagship lineup!
                </p>
              </div>
              <button
                onClick={() => setIsOrdersModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-mono text-xs font-bold rounded-xl transition-colors"
              >
                Explore GPUs
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id || order._id || order.orderNumber}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-cyan-400 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 border",
                    order.status === 'Delivered'
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : order.status === 'Shipped'
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  )}>
                    {order.status === 'Delivered' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : order.status === 'Shipped' ? (
                      <Truck className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{order.status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 py-1">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.mainImage ? (
                          <img
                            src={item.mainImage}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-200 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Total footer */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Ship to: <span className="text-slate-300">{order.shippingAddress.fullName}</span>, {order.shippingAddress.city}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">Total Paid:</span>
                    <span className="text-sm font-black text-cyan-400">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
