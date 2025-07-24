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
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productApi.getCategories();
      return response.data.data.map((category: any, index: number) => ({
        ...category,
        icon: categoryIcons[category.name] || Gift,
        color: categoryColors[index % categoryColors.length],
        itemCount: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}k+ items` // Random item count for demo
      }));
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

  if (isError || !categories) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Failed to load categories</h2>
            <p className="text-gray-600 mt-2">Please try again later</p>
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
