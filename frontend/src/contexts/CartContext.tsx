import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; payload: string | number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string | number; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string | number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'crazydeals_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        const updatedItems = [...state.items];
        const quantity = action.quantity || 1;
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        
        newState = {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + quantity,
          total: state.total + (action.payload.price * quantity),
        };
      } else {
        // Add new item to cart
        const quantity = action.quantity || 1;
        const newItem = {
          ...action.payload,
          quantity,
        };
        
        newState = {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + quantity,
          total: state.total + (action.payload.price * quantity),
        };
      }
      break;
    }
      
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id.toString() === action.payload.toString());
      if (!itemToRemove) return state;
      
      newState = {
        ...state,
        items: state.items.filter(item => item.id.toString() !== action.payload.toString()),
        itemCount: state.itemCount - itemToRemove.quantity,
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
      };
      break;
    }
      
    case 'UPDATE_QUANTITY': {
      const itemToUpdate = state.items.find(item => item.id.toString() === action.payload.id.toString());
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      
      const updatedItems = state.items.map(item => 
        item.id.toString() === action.payload.id.toString()
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      newState = {
        ...state,
        items: updatedItems,
        itemCount: state.itemCount + quantityDiff,
        total: state.total + (itemToUpdate.price * quantityDiff),
      };
      break;
    }
      
    case 'CLEAR_CART':
      newState = { items: [], itemCount: 0, total: 0 };
      break;
      
    default:
      return state;
  }
  
  // Persist to localStorage
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
    items: newState.items,
    itemCount: newState.itemCount,
    total: newState.total,
  }));
  
  return newState;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    total: 0,
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const { items, itemCount, total } = JSON.parse(savedCart);
        // Validate items in case the product structure changed
        const validItems = items.filter((item: any) => item.id && item.name && item.price !== undefined);
        dispatch({
          type: 'CLEAR_CART',
        });
        validItems.forEach((item: CartItem) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: item,
            quantity: item.quantity,
          });
        });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: product, quantity });
  };

  const removeFromCart = (productId: string | number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string | number) => {
    return state.items.some(item => item.id.toString() === productId.toString());
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
