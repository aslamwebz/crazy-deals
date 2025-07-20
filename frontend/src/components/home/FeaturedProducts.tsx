
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: 1199,
      originalPrice: 1399,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 324,
      badge: "New",
      badgeColor: "bg-green-500"
    },
    {
      id: 2,
      name: "Apple AirPods Pro 2",
      price: 199,
      originalPrice: 249,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 156,
      badge: "Hot",
      badgeColor: "bg-red-500"
    },
    {
      id: 3,
      name: "Dell XPS 13 Laptop",
      price: 899,
      originalPrice: 1199,
      image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 89,
      badge: "Limited",
      badgeColor: "bg-orange-500"
    },
    {
      id: 4,
      name: "iPad Air 5th Gen",
      price: 549,
      originalPrice: 649,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 203,
      badge: "Sale",
      badgeColor: "bg-blue-500"
    },
    {
      id: 5,
      name: "Nintendo Switch OLED",
      price: 299,
      originalPrice: 349,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 445,
      badge: "Popular",
      badgeColor: "bg-purple-500"
    },
    {
      id: 6,
      name: "Sony WF-1000XM4",
      price: 229,
      originalPrice: 279,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 167,
      badge: "Choice",
      badgeColor: "bg-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg">Hand-picked deals you can't miss</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
