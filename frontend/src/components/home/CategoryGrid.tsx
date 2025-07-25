import React from 'react';
import { Smartphone, Shirt, Home, Sparkles, Gamepad2, Book, Car, Gift, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';

// Map category names to icons
const categoryIcons: Record<string, React.ComponentType<any>> = {
  'Electronics': Smartphone,
  'Fashion': Shirt,
  'Home & Garden': Home,
  'Beauty': Sparkles,
  'Sports': Gamepad2,
  'Books': Book,
  'Automotive': Car,
  'Gifts': Gift,
};

// Color gradients for categories
const categoryColors = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
  'from-indigo-500 to-blue-600',
  'from-cyan-500 to-blue-500',
];

const CategoryGrid = () => {
  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // Make a direct fetch call to see the raw response
        const response = await fetch('http://localhost:8084/api/categories');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Categories API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          throw new Error(`Failed to load categories: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Categories API Response:', data);
        
        // Transform the response to match the expected format
        return (data.data || []).map((category: any, index: number) => ({
          ...category,
          icon: categoryIcons[category.name] || Gift,
          color: categoryColors[index % categoryColors.length],
          itemCount: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}k+ items` // Random item count for demo
        }));
      } catch (err) {
        console.error('Error fetching categories:', err);
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
          <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !categories) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Shop by Category</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error?.message || 'Failed to load categories. Please try again later.'}
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">Discover amazing deals across all categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-32 md:h-40">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <category.icon className="h-8 w-8 mb-2" />
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.itemCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
