
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Heart, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

const FlashDeals = () => {
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

  const flashDeals = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      originalPrice: 1199,
      salePrice: 899,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      sold: 24,
      total: 50,
      rating: 4.8
    },
    {
      id: 2,
      name: "Nike Air Max 270",
      originalPrice: 150,
      salePrice: 89,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      sold: 18,
      total: 30,
      rating: 4.6
    },
    {
      id: 3,
      name: "MacBook Air M2",
      originalPrice: 1299,
      salePrice: 999,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      sold: 12,
      total: 25,
      rating: 4.9
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      originalPrice: 399,
      salePrice: 279,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      sold: 31,
      total: 40,
      rating: 4.7
    }
  ];

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
          {flashDeals.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-destructive">
                  -{Math.round((1 - product.salePrice / product.originalPrice) * 100)}%
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl font-bold text-destructive">
                    ${product.salePrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Sold: {product.sold}</span>
                    <span>Available: {product.total - product.sold}</span>
                  </div>
                  <Progress value={(product.sold / product.total) * 100} />
                </div>
                
                <Button className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
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
