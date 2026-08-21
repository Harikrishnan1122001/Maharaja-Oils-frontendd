import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Addresses from "./pages/Addresses";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
// import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminBanners from "./pages/admin/AdminBanners";

// Storefront pages get the shared Navbar/Footer chrome.
const StoreLayout = ({ children }) => (
  <>
    <ScrollReveal />
    <Navbar />
    <main style={{ minHeight: "60vh" }}>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin panel has its own sidebar layout, no storefront Navbar/Footer */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
            <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />

            {/* Storefront routes */}
            <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
            <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
            <Route path="/category/:slug" element={<StoreLayout><Shop /></StoreLayout>} />
            <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
            <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
            <Route path="/wishlist" element={<StoreLayout><ProtectedRoute><Wishlist /></ProtectedRoute></StoreLayout>} />
            <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
            <Route path="/register" element={<StoreLayout><Register /></StoreLayout>} />
            <Route path="/checkout" element={<StoreLayout><ProtectedRoute><Checkout /></ProtectedRoute></StoreLayout>} />
            <Route path="/account" element={<StoreLayout><ProtectedRoute><Account /></ProtectedRoute></StoreLayout>} />
            <Route path="/account/addresses" element={<StoreLayout><ProtectedRoute><Addresses /></ProtectedRoute></StoreLayout>} />
            <Route path="/account/orders" element={<StoreLayout><ProtectedRoute><Orders /></ProtectedRoute></StoreLayout>} />
            <Route path="/account/orders/:id" element={<StoreLayout><ProtectedRoute><OrderDetail /></ProtectedRoute></StoreLayout>} />
            {/* <Route path="/about" element={<StoreLayout><About /></StoreLayout>} /> */}
            <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
            <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
