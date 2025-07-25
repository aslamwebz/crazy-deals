
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Eye, Zap, Clock } from 'lucide-react';
import { Product } from '@/types/product';

// Extend the Product type with additional properties used in the card
interface ProductCardProduct extends Product {
  originalPrice?: number;
  badge?: string;
  badgeColor?: string;
  reviews?: number;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);
  
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-card rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20 hover:scale-[1.02] transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Image container */}
      <div className="relative overflow-hidden rounded-t-3xl">
        <Link to={`/products/${product.slug}`} className="block">
          <img
            src={product.primary_image || product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        </Link>
        
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {product.badge && (
            <Badge className={`${product.badgeColor} text-white font-bold px-3 py-1 rounded-full animate-pulse shadow-lg`}>
              <Zap className="h-3 w-3 mr-1" />
              {product.badge}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Top right actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 ${
              isWishlisted 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 hover:bg-white text-black hover:scale-110'
            } ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isWishlisted) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product);
              }
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''} transition-all duration-300`} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black hover:scale-110 backdrop-blur-sm border border-white/20 transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-20'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick actions overlay */}
        <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add to Cart
          </Button>
        </div>

        {/* Stock indicator */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
            In Stock
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Product name */}
        <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors duration-300">
          <Link to={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-all duration-300 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current scale-110'
                      : 'text-gray-300'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {product.rating?.toFixed(1) || '0.0'} ({product.reviews || 0})
            </span>
          </div>
          
          {/* Urgency indicator */}
          <div className="flex items-center text-orange-500 text-xs">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            <span className="font-semibold">2h left</span>
          </div>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
            {product.compare_at_price > product.price && (
              <p className="text-xs text-green-600 font-semibold">
                You save ${(product.compare_at_price - product.price).toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Add to cart button */}
          <Button 
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Free shipping badge */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-green-600 font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Free Shipping
            </span>
            <span className="text-muted-foreground">
              Fast Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div className={`absolute -top-2 -right-2 transition-all duration-500 ${
        isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
          Hot Deal!
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
