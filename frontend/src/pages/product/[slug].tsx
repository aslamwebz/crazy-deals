import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ChevronLeft, ShoppingCart, Package, Shield, Truck, Undo } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug!)
  });
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
  };
  
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product?.total_quantity || 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-32 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground mt-2">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  if (!product) return null;
  
  const isOutOfStock = product.total_quantity <= 0;
  const discountPercentage = product.compare_at_price > 0 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/" className="flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to products
          </Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.reviews_count || 0} reviews)
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            {product.compare_at_price > product.price && (
              <div className="flex items-center space-x-2">
                <span className="text-lg text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              {product.description || 'No description available.'}
            </p>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium">Availability</h3>
              <p className={`mt-1 text-sm ${
                product.total_quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.total_quantity > 0 
                  ? `In Stock (${product.total_quantity} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:bg-transparent"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.total_quantity || 10) || isOutOfStock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:bg-transparent"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.total_quantity} available
                </span>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-6 text-base"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
                </Button>
                
                <Button variant="outline" className="w-full py-6 text-base" disabled={isOutOfStock}>
                  Buy Now
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on all orders over $50
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">2-Year Warranty</h4>
                  <p className="text-sm text-muted-foreground">
                    Covered for 2 years
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Undo className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
