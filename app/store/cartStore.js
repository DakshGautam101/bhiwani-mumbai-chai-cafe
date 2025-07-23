import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addToCart: async ({ userId, itemId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, itemId }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      const updatedCart = await response.json();
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeFromCart: async ({ userId, itemId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/removeFromCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, itemId }),
      });

      if (!response.ok) throw new Error("Failed to remove item from cart");

      const updatedCart = await response.json();
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error("Error removing from cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCart: async ({ userId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/clearCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to clear cart");

      const updatedCart = await response.json();
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error("Error clearing cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  displayCart: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart/displayCart?userId=${userId}`);

      if (!response.ok) throw new Error("Failed to fetch cart");

      const cartItems = await response.json();
      set({ cart: cartItems, isLoading: false });
    } catch (error) {
      console.error("Error displaying cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateQuantity: async ({ userId, itemId, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/updateQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, itemId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      const updatedCart = await response.json();
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useCartStore;
