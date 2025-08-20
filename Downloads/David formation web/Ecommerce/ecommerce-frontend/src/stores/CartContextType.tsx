import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type Article from '@/models/Article';

interface CartItem {
  article: Article;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (article: Article) => void;
  removeFromCart: (articleId: number) => void;
  updateQuantity: (articleId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  isInCart: (articleId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (article: Article) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.article.id === article.id);
      
      if (existingItem) {
        // Artikel bereits im Warenkorb, Menge erhöhen
        return prevItems.map(item =>
          item.article.id === article.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Neuer Artikel
        return [...prevItems, { article, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (articleId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.article.id !== articleId));
  };

  const updateQuantity = (articleId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(articleId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.article.id === articleId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (articleId: number) => {
    return cartItems.some(item => item.article.id === articleId);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};