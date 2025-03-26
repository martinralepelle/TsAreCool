import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItemType {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateCartItemQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const findCartItemIndex = (productId: number, size: string, color: string) => {
    return cartItems.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    );
  };

  const addToCart = (item: CartItemType) => {
    const existingItemIndex = findCartItemIndex(item.productId, item.size, item.color);
    
    if (existingItemIndex !== -1) {
      // Item exists, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
    } else {
      // Item doesn't exist, add new item
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (productId: number, size: string, color: string) => {
    setCartItems(cartItems.filter(item => 
      !(item.productId === productId && item.size === size && item.color === color)
    ));
  };

  const updateCartItemQuantity = (productId: number, size: string, color: string, quantity: number) => {
    const updatedItems = cartItems.map(item => 
      (item.productId === productId && item.size === size && item.color === color) 
        ? { ...item, quantity } 
        : item
    );
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      getCartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
