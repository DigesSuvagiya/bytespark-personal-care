// context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const refreshCart = async () => {
    const token = localStorage.getItem("bytesparkToken");
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      const res = await api.get("/cart");
      setCartItems(res.data || []);
    } catch (e) {
      console.error("Failed to refresh cart", e);
    }
  };

  // Load cart on app mount & page refresh
  useEffect(() => {
    refreshCart();
  }, []);

 const addToCart = async (product) => {
  try {
    const productId = product?._id || product?.id;

    if (!productId) {
      console.error("Invalid product passed to addToCart:", product);
      alert("Something went wrong. Product ID missing.");
      return;
    }

    const res = await api.post("/cart/add", { productId });
    setCartItems(res.data);
  } catch (error) {
    console.error("Add to cart failed:", error.response?.data || error.message);
    alert("Failed to add item to cart. Please try again.");
  }
};
  
  const increaseQuantity = async (productId) => {
    const res = await api.put("/cart/increase", { productId });
    setCartItems(res.data);
  };

 const decreaseQuantity = async (productId) => {
  try {
    const res = await api.put("/cart/decrease", { productId });
    setCartItems(res.data);
  } catch (error) {
    console.error("Decrease quantity failed:", error.response?.data || error.message);
    alert("Failed to update cart. Please try again.");
  }
};

const removeFromCart = async (productId) => {
  try {
    const res = await api.delete(`/cart/remove/${productId}`);
    setCartItems(res.data);
  } catch (error) {
    console.error("Remove from cart failed:", error.response?.data || error.message);
    alert("Failed to remove item. Please try again.");
  }
};

  const clearCart = async () => {
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
        refreshCart, // 👈 exposed
      }}
    >
      {children}
    </CartContext.Provider>
  );
}