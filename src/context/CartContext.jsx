import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("bytesparkToken")
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("bytesparkToken"));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Load cart on login / refresh
  useEffect(() => {
    if (isLoggedIn) {
      api.get("/cart")
        .then((res) => setCartItems(res.data))
        .catch(() => {});
    } else {
      setCartItems([]);
    }
  }, [isLoggedIn]);

  const addToCart = async (product) => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }
    const res = await api.post("/cart/add", { productId: product.id });
    setCartItems(res.data);
  };

  const increaseQuantity = async (productId) => {
    const res = await api.put("/cart/increase", { productId });
    setCartItems(res.data);
  };

  const decreaseQuantity = async (productId) => {
    const res = await api.put("/cart/decrease", { productId });
    setCartItems(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    setCartItems(res.data);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
