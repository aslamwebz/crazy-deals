import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Product } from '@/types/product';

type WishlistState = {
  items: Product[];
  itemCount: number;
};

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SYNC_WISHLIST'; payload: Product[] };

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'crazydeals_wishlist';

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  let newState = { ...state };
  
  switch (action.type) {
    case 'ADD_ITEM':
      if (!state.items.some(item => item.id === action.payload.id)) {
        newState = {
          ...state,
          items: [...state.items, action.payload],
          itemCount: state.itemCount + 1
        };
      }
      break;
      
    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemCount: Math.max(0, state.itemCount - 1)
      };
      break;
      
    case 'CLEAR_WISHLIST':
      newState = {
        items: [],
        itemCount: 0
      };
      break;
      
    case 'SYNC_WISHLIST':
      newState = {
        items: action.payload,
        itemCount: action.payload.length
      };
      break;
      
    default:
      return state;
  }
  
  // Save to localStorage if not syncing from localStorage
  if (action.type !== 'SYNC_WISHLIST') {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({
      items: newState.items,
      itemCount: newState.itemCount
    }));
  }
  
  return newState;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [], itemCount: 0 });
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const { items, itemCount } = JSON.parse(savedWishlist);
        dispatch({ type: 'SYNC_WISHLIST', payload: items });
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({
        items: state.items,
        itemCount: state.itemCount
      }));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [state.items, state.itemCount]);
  
  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const removeFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };
  
  const isInWishlist = (productId: number) => {
    return state.items.some(item => item.id === productId);
  };
  
  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
