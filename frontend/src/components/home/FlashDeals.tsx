import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

const FlashDeals = () => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { data: flashDeals = [], isLoading, isError, error } = useQuery({
    queryKey: ['flashDeals'],
    queryFn: async () => {
      try {
        // Make a direct fetch call to see the raw response
        const response = await fetch('http://localhost:8084/api/products/flash-deals');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Flash Deals API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          throw new Error(`Failed to load flash deals: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Flash Deals API Response:', data);
        
        // Transform the response to match the expected format
        return data.data || [];
      } catch (err) {
        console.error('Error fetching flash deals:', err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Flash Deals</h2>
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-sm border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading flash deals...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !flashDeals) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Flash Deals</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-4">No active flash deals at the moment.</p>
              <p className="text-sm text-gray-500">Check back later for amazing deals!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-destructive" />
            <h2 className="text-3xl font-bold">Flash Deals</h2>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-lg font-medium">Ends in:</span>
            <div className="flex space-x-2">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-destructive text-white px-3 py-2 rounded-lg">
                  <div className="text-xl font-bold">{String(value).padStart(2, '0')}</div>
                  <div className="text-xs uppercase">{unit.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map((product) => {
            const imageUrl = product.primary_image || (product.images && product.images[0]?.url);
            if (!imageUrl) return null;
            
            const discount = product.compare_at_price && product.price 
              ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
              : 0;
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 relative">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  {discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-destructive">
                      -{discount}%
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setWishlistLoading(product.id);
                      try {
                        if (isInWishlist(product.id)) {
                          await removeFromWishlist(product.id);
                          toast.success('Removed from wishlist');
                        } else {
                          await addToWishlist(product);
                          toast.success('Added to wishlist');
                        }
                      } catch (error) {
                        console.error('Error updating wishlist:', error);
                        toast.error('Failed to update wishlist');
                      } finally {
                        setWishlistLoading(null);
                      }
                    }}
                    disabled={wishlistLoading === product.id}
                  >
                    {wishlistLoading === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart 
                        className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : ''}`} 
                      />
                    )}
                  </Button>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-destructive">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center text-xs bg-muted px-1.5 py-0.5 rounded">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-0.5">{product.rating.toFixed(1)}</span>
                        {product.reviews_count > 0 && (
                          <span className="text-muted-foreground ml-1">({product.reviews_count})</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Sold: {product.sold_quantity || 0}</span>
                      <span>Available: {product.total_quantity - (product.sold_quantity || 0)}</span>
                    </div>
                    <Progress value={product.total_quantity > 0 ? ((product.sold_quantity || 0) / product.total_quantity) * 100 : 0} />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={addingToCart === product.id}
                    onClick={async (e) => {
                      e.preventDefault();
                      setAddingToCart(product.id);
                      try {
                        await addToCart(product);
                        toast.success(`${product.name} added to cart`);
                      } catch (error) {
                        console.error('Error adding to cart:', error);
                        toast.error('Failed to add item to cart');
                      } finally {
                        setAddingToCart(null);
                      }
                    }}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Flash Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
