import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Plus, Image as ImageIcon, ArrowLeft, Shield, Package, 
  Trash2, RefreshCw, CheckCircle2, Truck, Clock, AlertTriangle, Database, Cloud
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { GPUProduct } from '../types/gpu';
import { Order } from '../types/order';
import { cn } from '../lib/utils';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useShop();
  const { user, isAuthenticated, isAdmin, login } = useAuth();

  const [activeTab, setActiveTab] = useState<'create' | 'inventory' | 'orders'>('create');
  
  // Login form for quick admin access if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('admin@vramvault.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Create Product State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '15',
    category: '4-8 vram' as const,
    vramGB: '8',
    vramType: 'GDDR6',
    busWidth: '128-bit',
    cooling: 'Dual Fan',
    tagline: '',
    badge: 'NEW',
    tdpWatts: '140',
    recommendedPsu: '550',
    coreClock: '2200',
    boostClock: '2600',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inventory & Orders Data
  const [products, setProducts] = useState<GPUProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load Inventory & Orders
  const loadInventory = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    if (!isAdmin) return;
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadInventory();
      loadOrders();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await login({ email: adminEmail, password: adminPassword });
      showToast('Admin authenticated successfully', 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid admin credentials');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return showToast('Please select a GPU product image first', 'warning');
    
    setIsSubmitting(true);
    try {
      // 1. Upload Image via Cloudinary endpoint
      showToast('Uploading graphics card image to Cloudinary...', 'info');
      const uploadResult = await api.uploadImage(imageFile);
      const imageUrl = uploadResult.imageUrl;

      // 2. Create Product Payload
      const productPayload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        stockUnits: Number(formData.stock),
        category: formData.category,
        vramGB: Number(formData.vramGB),
        vramType: formData.vramType,
        busWidth: formData.busWidth,
        cooling: formData.cooling,
        tagline: formData.tagline,
        description: formData.tagline,
        badge: formData.badge || undefined,
        tdpWatts: Number(formData.tdpWatts),
        recommendedPsu: Number(formData.recommendedPsu),
        coreClock: Number(formData.coreClock),
        boostClock: Number(formData.boostClock),
        mainImage: imageUrl,
        inStock: Number(formData.stock) > 0,
        benchmarks: [
          { game: 'Cyberpunk 2077 (High)', fps1080p: 85, fps1440p: 60, fps4k: 32 },
          { game: 'Black Myth: Wukong', fps1080p: 72, fps1440p: 50, fps4k: 28 },
          { game: 'Valorant / CS2', fps1080p: 320, fps1440p: 240, fps4k: 140 }
        ],
        ports: ['3x DisplayPort 1.4a', '1x HDMI 2.1'],
        features: ['Precision Vapor Chamber', 'Zero RPM Silent Mode', 'Reinforced Metal Backplate']
      };

      await api.createProduct(productPayload);
      showToast('GPU Published Live to MongoDB Atlas & Store!', 'success');

      // Reset form & reload
      setFormData({
        name: '',
        price: '',
        stock: '15',
        category: '4-8 vram',
        vramGB: '8',
        vramType: 'GDDR6',
        busWidth: '128-bit',
        cooling: 'Dual Fan',
        tagline: '',
        badge: 'NEW',
        tdpWatts: '140',
        recommendedPsu: '550',
        coreClock: '2200',
        boostClock: '2600',
      });
      setImageFile(null);
      setImagePreview('');
      await loadInventory();
      setActiveTab('inventory');
    } catch (error: any) {
      showToast(error.message || 'Failed to add product', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) return;
    try {
      await api.deleteProduct(id);
      showToast(`Removed "${name}" from database`, 'info');
      setProducts(products.filter(p => p.id !== id && (p as any)._id !== id));
    } catch (e: any) {
      showToast(e.message || 'Failed to delete product', 'warning');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders();
    } catch (e: any) {
      showToast(e.message || 'Failed to update order status', 'warning');
    }
  };

  // If not logged in as Admin, show login screen
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-slate-900/80 border border-amber-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-slate-400 font-mono">Sign in with system administrator privileges</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Sign In as Administrator
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-mono flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] p-4 sm:p-8 text-white relative font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Admin Hardware Console</h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">MongoDB Atlas & Cloudinary Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('create')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                activeTab === 'create'
                  ? "bg-cyan-500 text-slate-950 font-black shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Plus className="w-4 h-4" /> Add GPU
            </button>
            <button
              onClick={() => { setActiveTab('inventory'); loadInventory(); }}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                activeTab === 'inventory'
                  ? "bg-cyan-500 text-slate-950 font-black shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Package className="w-4 h-4" /> Catalog ({products.length})
            </button>
            <button
              onClick={() => { setActiveTab('orders'); loadOrders(); }}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                activeTab === 'orders'
                  ? "bg-cyan-500 text-slate-950 font-black shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Truck className="w-4 h-4" /> Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* TAB 1: ADD NEW GPU */}
        {activeTab === 'create' && (
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 text-white">
              <Plus className="text-cyan-400 w-5 h-5" /> Add New Graphics Card to Store
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Cloudinary Image Upload Box */}
              <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-6 text-center hover:border-cyan-500 transition-colors bg-slate-950/40">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-48 h-40 object-contain mx-auto filter drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)]" 
                    />
                    <p className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Cloudinary Upload
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-400">Click below to choose GPU photo from your device</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="admin-img-upload" 
                />
                <label 
                  htmlFor="admin-img-upload" 
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-cyan-400 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" /> {imagePreview ? 'Change Image' : 'Select Product Photo'}
                </label>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Model Name</label>
                  <input 
                    placeholder="e.g. Apex Omniverse 24G Colossus" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Price ($ USD)</label>
                  <input 
                    placeholder="e.g. 1499.99" 
                    type="number" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Available Stock Units</label>
                  <input 
                    placeholder="e.g. 15" 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">VRAM Capacity (GB)</label>
                  <input 
                    placeholder="e.g. 24" 
                    type="number" 
                    value={formData.vramGB} 
                    onChange={e => setFormData({...formData, vramGB: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Category Tier</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500 text-slate-200"
                  >
                    <option value="4-8 vram">4 - 8 GB VRAM</option>
                    <option value="8-12 vram">8 - 12 GB VRAM</option>
                    <option value="16-24 vram">16 - 24 GB VRAM</option>
                    <option value="24 and above vram">24+ GB VRAM Titan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Cooling Solution</label>
                  <select 
                    value={formData.cooling} 
                    onChange={e => setFormData({...formData, cooling: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500 text-slate-200"
                  >
                    <option value="Dual Fan">Dual Fan</option>
                    <option value="Triple Fan">Triple Fan</option>
                    <option value="Liquid Vapor-Chamber">Liquid Vapor-Chamber</option>
                    <option value="Blower Edition">Blower Edition</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">VRAM Type</label>
                  <input 
                    placeholder="e.g. GDDR6X" 
                    value={formData.vramType} 
                    onChange={e => setFormData({...formData, vramType: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">TDP Watts</label>
                  <input 
                    placeholder="e.g. 450" 
                    type="number" 
                    value={formData.tdpWatts} 
                    onChange={e => setFormData({...formData, tdpWatts: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Badge (Optional)</label>
                  <input 
                    placeholder="FLAGSHIP, BESTSELLER, NEW..." 
                    value={formData.badge} 
                    onChange={e => setFormData({...formData, badge: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-mono text-slate-400">Tagline / Summary</label>
                  <input 
                    placeholder="e.g. Extreme enthusiast-tier compute card engineered for native 4K gaming..." 
                    value={formData.tagline} 
                    onChange={e => setFormData({...formData, tagline: e.target.value})} 
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none focus:border-cyan-500" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading to Cloudinary & Publishing to MongoDB Atlas...' : 'Publish Graphics Card to Store'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: INVENTORY LIST */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Package className="text-cyan-400 w-5 h-5" /> MongoDB Atlas Catalog ({products.length} GPUs)
              </h2>
              <button 
                onClick={loadInventory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-mono hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Card</th>
                    <th className="py-3 px-3">VRAM</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock Units</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id || (p as any)._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img 
                          src={p.mainImage} 
                          alt={p.name} 
                          className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white font-sans text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.code || 'GPU'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{p.vramGB} GB</td>
                      <td className="py-3 px-3 text-slate-300">{p.category}</td>
                      <td className="py-3 px-3 font-bold text-white">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={cn("px-2 py-0.5 rounded text-[10px]", (p.stockUnits || 0) > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                          {p.stockUnits ?? p.stockUnits ?? 0} in stock
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id || (p as any)._id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Truck className="text-cyan-400 w-5 h-5" /> Customer Purchases & Orders ({orders.length})
              </h2>
              <button 
                onClick={loadOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-mono hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">
                No customer orders placed yet. Place a test order from the checkout modal!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id || ord._id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                          {ord.orderNumber}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id || (ord as any)._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Customer Details</p>
                        <p className="text-white font-bold">{ord.shippingAddress.fullName}</p>
                        <p className="text-slate-400">{ord.shippingAddress.email}</p>
                        <p className="text-slate-400">{ord.shippingAddress.address}, {ord.shippingAddress.city}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Ordered Hardware</p>
                        {ord.orderItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-0.5">
                            <span className="text-slate-300">{item.name} x{item.quantity}</span>
                            <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-1 border-t border-slate-800 mt-1 font-bold text-cyan-400">
                          <span>Total Amount Paid</span>
                          <span>${ord.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
