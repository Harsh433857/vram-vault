import React, { createContext, useContext, useState, useEffect } from 'react';
import { GPUProduct, CartItem, FilterState } from '../types/gpu';
import { api } from '../lib/api';
import fallbackProducts from '../data/fallbackProducts.json';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  filters: FilterState;
  activeModalProduct: GPUProduct | null;
  products: GPUProduct[]; 
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  isCartOpen: boolean;
  isCompareOpen: boolean;
  isCheckoutOpen: boolean;
  isPSUCalculatorOpen: boolean;
  isDeskShowcaseOpen: boolean;
  selectedDeskShowcaseId: string | null;
  toasts: Toast[];

  // Cart actions
  addToCart: (product: GPUProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare actions
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Filters actions
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredProducts: GPUProduct[];

  // Modal actions
  openDetailModal: (product: GPUProduct) => void;
  closeDetailModal: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCompareOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsPSUCalculatorOpen: (open: boolean) => void;
  setIsDeskShowcaseOpen: (open: boolean) => void;
  openDeskShowcase: (deskId?: string) => void;
  closeDeskShowcase: () => void;

  // Toasts
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  search: '',
  category: 'all',
  cooling: 'all',
  minPrice: 150,
  maxPrice: 2600,
  inStockOnly: false,
  sortBy: 'featured',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vram_vault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vram_vault_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeModalProduct, setActiveModalProduct] = useState<GPUProduct | null>(null);

  // Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPSUCalculatorOpen, setIsPSUCalculatorOpen] = useState(false);
  const [isDeskShowcaseOpen, setIsDeskShowcaseOpen] = useState(false);
  const [selectedDeskShowcaseId, setSelectedDeskShowcaseId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vram_vault_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vram_vault_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const addToCart = (product: GPUProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Load products from backend (with immediate fallback)
  const [products, setProducts] = useState<GPUProduct[]>(fallbackProducts as unknown as GPUProduct[]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (error) {
      console.warn("Could not fetch latest products from API, using cached/fallback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`Saved "${prod?.name || 'Card'}" to favorites`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare Handlers
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from comparison', 'info');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('Comparison limit reached! Max 3 cards.', 'warning');
        return prev;
      }
      const prod = products.find((p) => p.id === productId);
      showToast(`Added "${prod?.name || 'Card'}" to comparison`, 'success');
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  };

  const isInCompare = (productId: string) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  // Filter Handlers
  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    showToast('Filters reset', 'info');
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter((product) => {
    // Search query filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCode = product.code.toLowerCase().includes(q);
      const matchTag = product.tagline.toLowerCase().includes(q);
      const matchVram = `${product.vramGB}gb`.includes(q) || `${product.vramGB} gb`.includes(q);
      if (!matchName && !matchCode && !matchTag && !matchVram) return false;
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Cooling filter
    if (filters.cooling !== 'all' && product.cooling !== filters.cooling) {
      return false;
    }

    // Price range
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // In Stock
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'vram-desc':
        return b.vramGB - a.vramGB;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'featured':
      default:
        return 0; // maintain original curated order
    }
  });

  // Modal Handlers
  const openDetailModal = (product: GPUProduct) => {
    setActiveModalProduct(product);
  };

  const closeDetailModal = () => {
    setActiveModalProduct(null);
  };

  const openDeskShowcase = (deskId?: string) => {
    if (deskId) setSelectedDeskShowcaseId(deskId);
    setIsDeskShowcaseOpen(true);
  };

  const closeDeskShowcase = () => {
    setIsDeskShowcaseOpen(false);
    setSelectedDeskShowcaseId(null);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        compareList,
        filters,
        activeModalProduct,
        products, 
        isLoading,
        refreshProducts,
        isCartOpen,
        isCompareOpen,
        isCheckoutOpen,
        isPSUCalculatorOpen,
        isDeskShowcaseOpen,
        selectedDeskShowcaseId,
        toasts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        setFilter,
        resetFilters,
        filteredProducts,
        openDetailModal,
        closeDetailModal,
        setIsCartOpen,
        setIsCompareOpen,
        setIsCheckoutOpen,
        setIsPSUCalculatorOpen,
        setIsDeskShowcaseOpen,
        openDeskShowcase,
        closeDeskShowcase,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
