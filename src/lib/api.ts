// In production the Express server also serves the frontend, so the API is on the same site ("/api").
// In local development the API runs on port 5000.
const API_URL =
  (import.meta as any).env?.VITE_API_URL ||
  ((import.meta as any).env?.PROD ? '/api' : 'http://localhost:5000/api');

let authToken: string | null = localStorage.getItem('vram_vault_token') || null;

const getHeaders = (isJson = true) => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const api = {
  setAuthToken: (token: string | null) => {
    authToken = token;
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch products');
    }
    return res.json();
  },

  getProductById: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch product');
    }
    return res.json();
  },

  createProduct: async (productData: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create product');
    }
    return res.json();
  },

  updateProduct: async (id: string, updates: any) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update product');
    }
    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete product');
    }
    return res.json();
  },

  seedProducts: async () => {
    const res = await fetch(`${API_URL}/products/seed`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to seed products');
    }
    return res.json();
  },

  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email or password');
    }
    return res.json();
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error('Not authorized');
    }
    return res.json();
  },

  // Orders / Purchasing
  createOrder: async (orderPayload: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order');
    }
    return res.json();
  },

  getMyOrders: async () => {
    const res = await fetch(`${API_URL}/orders/myorders`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch orders');
    }
    return res.json();
  },

  getAllOrders: async () => {
    const res = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch all orders');
    }
    return res.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update order status');
    }
    return res.json();
  },

  // Upload (Cloudinary)
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Image upload failed');
    }
    return res.json();
  },
};
