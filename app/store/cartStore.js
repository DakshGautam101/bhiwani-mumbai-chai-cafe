import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addToCart: async ({ userId, itemId, price, quantity = 1 }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemId,
          price: typeof price === "string" ? parseFloat(price) : Number(price || 0),
          quantity: Number(quantity) || 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      const data = await response.json();
      // Handle both array response and object with cart property
      const updatedCart = Array.isArray(data) ? data : (data.cart || []);
      
      // Normalize cart items to ensure quantity is a number
      const normalizedCart = updatedCart.map(item => ({
        ...item,
        quantity: Number(item.quantity || item.qty || 1)
      }));
      set({ cart: normalizedCart, isLoading: false });
    } catch (error) {
      console.error("Add to cart error:", error);
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove item from cart");
      }

      const data = await response.json();
      // Handle both array response and object with cart property
      const updatedCart = Array.isArray(data) ? data : (data.cart || []);
      
      // Normalize cart after removal
      const normalizedCart = updatedCart.map(item => ({
        ...item,
        quantity: Number(item.quantity || item.qty || 1)
      }));
      set({ cart: normalizedCart, isLoading: false });
    } catch (error) {
      console.error("Error removing from cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Alias for removeFromCart to match component usage
  removeItem: async ({ userId, itemId }) => {
    return get().removeFromCart({ userId, itemId });
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to clear cart");
      }

      const data = await response.json();
      // Handle both array response and object with cart property
      const updatedCart = Array.isArray(data) ? data : (data.cart || []);
      
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch cart");
      }

      const data = await response.json();
      // Handle both array response and object with cart property
      const cartItems = Array.isArray(data) ? data : (data.cart || []);
      
      // Normalize quantities when displaying cart
      const normalizedCart = cartItems.map(item => ({
        ...item,
        quantity: Number(item.quantity || item.qty || 1)
      }));
      set({ cart: normalizedCart, isLoading: false });
    } catch (error) {
      console.error("Error displaying cart:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateQuantity: async ({ userId, itemId, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure quantity is a positive number
      const validQuantity = Math.max(1, Number(quantity) || 1);
      
      const response = await fetch("/api/cart/updateQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId, 
          itemId, 
          quantity: validQuantity 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update quantity");
      }

      const data = await response.json();
      // Handle both array response and object with cart property
      const updatedCart = Array.isArray(data) ? data : (data.cart || []);
      
      // Normalize cart after quantity update
      const normalizedCart = updatedCart.map(item => ({
        ...item,
        quantity: Number(item.quantity || item.qty || 1)
      }));
      set({ cart: normalizedCart, isLoading: false });
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get cart item count
  getCartCount: () => {
    const { cart } = get();
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  },

  // Get cart total price
  getCartTotal: () => {
    const { cart } = get();
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  },

  // Check if item exists in cart
  isItemInCart: (itemId) => {
    const { cart } = get();
    if (!Array.isArray(cart)) return false;
    return cart.some(item => (item._id || item.id) === itemId);
  },

  // Get item quantity from cart
  getItemQuantity: (itemId) => {
    const { cart } = get();
    if (!Array.isArray(cart)) return 0;
    const item = cart.find(item => (item._id || item.id) === itemId);
    return item ? Number(item.quantity || 1) : 0;
  },
}));

export default useCartStore;