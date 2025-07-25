
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { Product } from '@/types/product';

const FeaturedProducts = () => {
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async (): Promise<Product[]> => {
      try {
        // Make a direct fetch call to see the raw response
        const response = await fetch('http://localhost:8084/api/products/featured');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Featured Products API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          throw new Error(`Failed to load featured products: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Featured Products API Response:', data);
        
        // Transform the response to match the expected format
        return data.data || [];
      } catch (err) {
        console.error('Error fetching featured products:', err);
        throw err;
      }
    },
    retry: 2, // Retry failed requests
    refetchOnWindowFocus: false // Don't refetch when window regains focus
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !products) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Featured Products</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error?.message || 'Failed to load featured products. Please try again later.'}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none"
                  >
                    Try again <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
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
