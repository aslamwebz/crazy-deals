import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function CartIcon() {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
            {itemCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md border bg-white shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Your Cart</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            
            <CartDropdownContent />
            
            <div className="mt-4 flex justify-between items-center border-t pt-4">
              <span className="font-medium">Total items: {itemCount}</span>
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button size="sm">View Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartDropdownContent() {
  const { items, removeFromCart, updateQuantity } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Your cart is empty
      </div>
    );
  }
  
  return (
    <div className="max-h-60 overflow-y-auto">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center space-x-3 py-2">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
              <img
                src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{item.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-md border text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-md border text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove item"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
