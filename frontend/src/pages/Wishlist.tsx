import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    // Since we can't modify the Product type, we'll use type assertion here
    // as we know these properties are safe to pass to the cart
    addToCart(product as any, 1);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8">
          Save items you love to your wishlist by clicking the heart icon.
        </p>
        <Button asChild>
          <Link to="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/" className="flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistItems.length} items</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearWishlist}
          disabled={wishlistItems.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="divide-y">
          {wishlistItems.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                to={`/products/${item.slug}`}
                className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border"
              >
                <img
                  src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium hover:text-primary transition-colors">
                  <Link to={`/products/${item.slug}`} className="hover:underline">
                    {item.name}
                  </Link>
                </h3>
                <div className="mt-1">
                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                  {item.compare_at_price && item.compare_at_price > item.price ? (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      ${item.compare_at_price.toFixed(2)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  {item.in_stock ? (
                    <span className="flex items-center text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                      In Stock
                    </span>
                  ) : (
                    <span className="text-amber-600">Out of Stock</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Remove
                </Button>
                <Button 
                  size="sm" 
                  className="w-full sm:w-auto"
                  onClick={() => handleMoveToCart(item)}
                  disabled={!item.in_stock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
