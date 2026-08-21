import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/endpoints";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.get();
      setCart(res.data.cart);
    } catch {
      // silent - cart just stays empty
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, variantId, quantity = 1) => {
    const res = await cartApi.add({ productId, variantId, quantity });
    setCart(res.data.cart);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await cartApi.update(itemId, quantity);
    setCart(res.data.cart);
  };

  const removeItem = async (itemId) => {
    const res = await cartApi.remove(itemId);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await cartApi.clear();
    setCart({ items: [] });
  };

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, subtotal, addItem, updateItem, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
