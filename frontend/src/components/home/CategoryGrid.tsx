import React, { useEffect } from 'react';
import { Smartphone, Shirt, Home, Sparkles, Gamepad2, Book, Car, Gift, Loader2, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { productApi } from '@/lib/api';

// Base category type from API
type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
};

// Enhanced category type for the component
type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: React.ComponentType<any>;
  color: string;
  itemCount: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: ApiCategory[];
};

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
  const navigate = useNavigate();
  
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      console.log('Fetching categories...');
      
      // Make a direct fetch call to see the raw response
      const response = await fetch('http://localhost:8084/api/categories');
      const responseData = await response.json();
      console.log('Raw Categories API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle different response formats
      let categoriesList: any[] = [];
      
      // If the response is an array, use it directly
      if (Array.isArray(responseData)) {
        categoriesList = responseData;
      } 
      // If the response has a data property that's an array
      else if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        if (Array.isArray(responseData.data)) {
          categoriesList = responseData.data;
        } else {
          console.warn('Unexpected data format in response.data:', responseData.data);
        }
      }
      
      // If we still don't have categories, try to extract them from the response
      if (!categoriesList.length) {
        console.warn('No categories found in the expected format, attempting to parse response:', responseData);
        // Try to extract categories from the response if they're nested differently
        const possibleCategories = Object.values(responseData).find(Array.isArray);
        if (Array.isArray(possibleCategories)) {
          categoriesList = possibleCategories;
        }
      }
      
      if (!categoriesList.length) {
        throw new Error('No categories found in the response');
      }
      
      console.log('Processed categories:', categoriesList);
      
      // Transform API categories to component categories
      return categoriesList.map((category: any, index: number) => ({
        id: category.id || index,
        name: category.name || 'Unnamed Category',
        slug: category.slug || `category-${index}`,
        description: category.description || '',
        image: category.image || '/placeholder-category.jpg',
        icon: categoryIcons[category.name] || Gift,
        color: categoryColors[index % categoryColors.length],
        itemCount: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}k+ items`
      }));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in categories query:', {
        error: errorMessage,
        originalError: err,
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to load categories. Please try again later.');
    }
  };

  const { 
    data: categories = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  // Log errors to console when they occur
  useEffect(() => {
    if (error) {
      console.error('Categories query error:', error);
    }
  }, [error]);
  
  const handleCategoryClick = (slug: string) => {
    // Store scroll position in session storage before navigation
    sessionStorage.setItem('shouldScrollToTop', 'true');
    // Use 'categories' parameter to match the Shop page's expected filter
    navigate(`/shop?categories=${encodeURIComponent(slug)}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Discover amazing deals across all categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !categories.length) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Discover amazing deals across all categories</p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-destructive/10 border border-destructive/30 rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-destructive/10 p-3 rounded-full mb-4">
                <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-destructive mb-2">Failed to load categories</h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || 'There was an error loading categories. Please try again.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <span>Try Again</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category.slug)}
                aria-label={`Browse ${category.name}`}
              >
                <div className="relative h-32 md:h-40">
                  <img
                    src={category.image || '/placeholder-category.jpg'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-category.jpg';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent`} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                    <div className={`p-3 rounded-full mb-2 bg-${category.color.split(' ')[0]}/10`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.itemCount}</p>
                    
                    <div className="mt-2 flex items-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Shop now</span>
                      <ChevronRight className="h-4 w-4 ml-1 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/categories')}
            className="px-8 py-6 text-base"
          >
            View All Categories
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
