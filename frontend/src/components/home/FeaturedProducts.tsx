
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';

const FeaturedProducts = () => {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await productApi.getFeaturedProducts();
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !products) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Failed to load featured products</h2>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg">Hand-picked deals you can't miss</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (product.primary_image || (product.images && product.images[0]?.url)) && (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                image: product.primary_image || (product.images && product.images[0]?.url) || '',
              }} 
            />
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
