
import React from 'react';
import { Smartphone, Shirt, Home, Sparkles, Gamepad2, Book, Car, Gift } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      itemCount: '2.5k+ items',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      name: 'Fashion',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      itemCount: '3.2k+ items',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 3,
      name: 'Home & Garden',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      itemCount: '1.8k+ items',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 4,
      name: 'Beauty',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      itemCount: '1.5k+ items',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 5,
      name: 'Sports',
      icon: Gamepad2,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      itemCount: '950+ items',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      name: 'Books',
      icon: Book,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      itemCount: '2.1k+ items',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 7,
      name: 'Automotive',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
      itemCount: '750+ items',
      color: 'from-gray-500 to-slate-600'
    },
    {
      id: 8,
      name: 'Gifts',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      itemCount: '1.2k+ items',
      color: 'from-red-500 to-pink-500'
    }
  ];

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
