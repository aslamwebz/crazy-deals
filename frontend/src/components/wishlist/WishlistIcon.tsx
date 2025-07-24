import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function WishlistIcon() {
  const { itemCount, items, removeFromWishlist } = useWishlist();
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
        className="relative group"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Wishlist"
      >
        <Heart 
          className={`h-5 w-5 ${itemCount > 0 ? 'fill-current text-red-500' : ''}`} 
          strokeWidth={itemCount > 0 ? 2 : 1.5} 
        />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md border bg-white shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Wishlist</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            
            <WishlistDropdownContent />
            
            <div className="mt-4 flex justify-between items-center border-t pt-4">
              <span className="text-sm text-muted-foreground">{itemCount} items</span>
              <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                <Button size="sm">View All</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistDropdownContent() {
  const { items, removeFromWishlist } = useWishlist();
  
  if (items.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Your wishlist is empty
      </div>
    );
  }
  
  return (
    <div className="max-h-60 overflow-y-auto">
      <ul className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <li key={item.id} className="flex items-start space-x-3 py-2">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
              <img
                src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">
                <Link to={`/products/${item.slug}`} className="hover:underline">
                  {item.name}
                </Link>
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove from wishlist"
            >
              ×
            </button>
          </li>
        ))}
        {items.length > 5 && (
          <li className="text-center text-sm text-muted-foreground">
            +{items.length - 5} more items
          </li>
        )}
      </ul>
    </div>
  );
}
