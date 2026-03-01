import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { token, isAdmin } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!token || isAdmin) {
      setCartItems([]);
      return;
    }

    try {
      const res = await api.get("/cart");
      setCartItems(res.data || []);
    } catch (error) {
      console.error("Failed to refresh cart", error);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product) => {
    if (isAdmin) {
      alert("Cart is not available for admin login.");
      return;
    }

    try {
      const productId = product?._id || product?.id;

      if (!productId) {
        console.error("Invalid product passed to addToCart:", product);
        alert("Something went wrong. Product ID missing.");
        return;
      }

      const res = await api.post("/cart/add", { productId });
      setCartItems(res.data || []);
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const increaseQuantity = async (productId) => {
    if (isAdmin) return;
    const res = await api.put("/cart/increase", { productId });
    setCartItems(res.data || []);
  };

  const decreaseQuantity = async (productId) => {
    if (isAdmin) return;

    try {
      const res = await api.put("/cart/decrease", { productId });
      setCartItems(res.data || []);
    } catch (error) {
      console.error("Decrease quantity failed:", error.response?.data || error.message);
      alert("Failed to update cart. Please try again.");
    }
  };

  const removeFromCart = async (productId) => {
    if (isAdmin) return;

    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCartItems(res.data || []);
    } catch (error) {
      console.error("Remove from cart failed:", error.response?.data || error.message);
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    if (isAdmin) {
      setCartItems([]);
      return;
    }

    await api.delete("/cart/clear");
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
