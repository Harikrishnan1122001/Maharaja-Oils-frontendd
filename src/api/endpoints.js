import api from "./axios";

// ---- Auth ----
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// ---- Categories ----
export const categoryApi = {
  list: () => api.get("/categories"),
  bySlug: (slug) => api.get(`/categories/${slug}`),
};

// ---- Products ----
export const productApi = {
  list: (params) => api.get("/products", { params }),
  featured: () => api.get("/products", { params: { featured: true } }),
  bySlug: (slug) => api.get(`/products/${slug}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  // Lightweight live-search used by the search control (Navbar dropdown).
  search: (q) => api.get("/products/search", { params: { q } }),
};

// ---- Cart ----
export const cartApi = {
  get: () => api.get("/cart"),
  add: (data) => api.post("/cart", data),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete("/cart"),
};

// ---- Wishlist ----
export const wishlistApi = {
  get: () => api.get("/wishlist"),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// ---- Addresses ----
export const addressApi = {
  list: () => api.get("/addresses"),
  add: (data) => api.post("/addresses", data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  remove: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/default`),
};

// ---- Payment (Razorpay) ----
export const paymentApi = {
  createOrder: (amount) => api.post("/payment/razorpay/order", { amount }),
  verify: (data) => api.post("/payment/razorpay/verify", data),
};

// ---- Orders ----
// body: { shippingAddress, paymentMethod, paymentResult, couponCode }
export const orderApi = {
  place: (data) => api.post("/orders", data),
  myOrders: () => api.get("/orders/my"),
  byId: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  // Streams the PDF invoice as a blob so it can be downloaded client-side.
  invoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: "blob" }),
};

// ---- Contact Us ----
export const contactApi = {
  send: (data) => api.post("/contact", data),
};

// ---- Banners ----
export const bannerApi = {
  list: () => api.get("/banners"),
};

// ---- Settings (public) ----
export const settingsApi = {
  get: () => api.get("/settings"),
};

// ---- Admin ----
export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),

  // Categories
  createCategory: (formData) =>
    api.post("/admin/categories", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateCategory: (id, formData) =>
    api.put(`/admin/categories/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Products
  createProduct: (formData) =>
    api.post("/admin/products", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id, formData) =>
    api.put(`/admin/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProductImage: (id, publicId) => api.delete(`/admin/products/${id}/images/${encodeURIComponent(publicId)}`),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Banners
  allBanners: () => api.get("/admin/banners"),
  createBanner: (formData) =>
    api.post("/admin/banners", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateBanner: (id, formData) =>
    api.put(`/admin/banners/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),

  // Orders
  allOrders: (params) => api.get("/admin/orders", { params }),
  orderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, orderStatus, trackingId) =>
    api.put(`/admin/orders/${id}/status`, { orderStatus, trackingId }),

  // Users
  allUsers: () => api.get("/admin/users"),
  userById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

  // Coupons
  coupons: () => api.get("/admin/coupons"),
  createCoupon: (data) => api.post("/admin/coupons", data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  // Settings
  updateSettings: (formData) =>
    api.put("/admin/settings", formData, { headers: { "Content-Type": "multipart/form-data" } }),
};
