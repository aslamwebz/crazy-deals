import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { ProductFilters } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';



// Mock price ranges
const priceRanges = [
  { id: '0-50', name: 'Under $50', min: 0, max: 50 },
  { id: '50-100', name: '$50 - $100', min: 50, max: 100 },
  { id: '100-200', name: '$100 - $200', min: 100, max: 200 },
  { id: '200-500', name: '$200 - $500', min: 200, max: 500 },
  { id: '500-1000', name: '$500 - $1000', min: 500, max: 1000 },
  { id: '1000', name: 'Over $1000', min: 1000, max: Infinity },
];

// Mock ratings
const ratings = [4, 3, 2, 1].map(rating => ({
  id: `${rating}`,
  name: `${rating} & Up`,
  value: rating,
}));

// Mock brands
const brands = [
  { id: 'samsung', name: 'Samsung', count: 45 },
  { id: 'apple', name: 'Apple', count: 38 },
  { id: 'sony', name: 'Sony', count: 29 },
  { id: 'lg', name: 'LG', count: 24 },
  { id: 'hp', name: 'HP', count: 19 },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: searchParams.get('categories')?.split(',') || [],
    priceRange: searchParams.get('priceRange') || '',
    minRating: searchParams.get('minRating') || '',
    brands: searchParams.get('brands')?.split(',') || [],
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'featured',
  });

  // Handle URL parameters and filter state synchronization
  useEffect(() => {
    // Get current URL parameters
    const params = new URLSearchParams(searchParams);
    
    // Create new filter state based on URL
    const newFilters = {
      categories: params.get('categories')?.split(',').filter(Boolean) || [],
      priceRange: params.get('priceRange') || '',
      minRating: params.get('minRating') || '',
      brands: params.get('brands')?.split(',').filter(Boolean) || [],
      search: params.get('search') || '',
      sort: params.get('sort') || 'featured',
    };

    // Only update state if there are actual changes
    if (JSON.stringify(newFilters) !== JSON.stringify(activeFilters)) {
      setActiveFilters(newFilters);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (activeFilters.search) params.set('search', activeFilters.search);
    if (activeFilters.categories.length) params.set('categories', activeFilters.categories.join(','));
    if (activeFilters.priceRange) params.set('priceRange', activeFilters.priceRange);
    if (activeFilters.minRating) params.set('minRating', activeFilters.minRating);
    if (activeFilters.brands.length) params.set('brands', activeFilters.brands.join(','));
    if (activeFilters.sort) params.set('sort', activeFilters.sort);
    
    // Only update URL if there are changes to avoid infinite loops
    const currentParams = new URLSearchParams(searchParams);
    if (params.toString() !== currentParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [activeFilters, searchParams, setSearchParams]);

  // Debounce URL updates to prevent too many re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlParams();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [updateUrlParams]);

  // Memoize the query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => {
    const { search, categories, priceRange, minRating, brands, sort } = activeFilters;
    return [
      'products',
      search || '',
      categories.sort().join(','),
      priceRange || '',
      minRating || '',
      brands.sort().join(','),
      sort || 'featured',
    ];
  }, [activeFilters]);

  // Memoize the query function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      // Convert category slugs to IDs if needed
      const categorySlugs = activeFilters.categories || [];
      
      const params: ProductFilters = {
        search: activeFilters.search || undefined,
        categories: categorySlugs.length ? categorySlugs : undefined,
        priceRange: activeFilters.priceRange || undefined,
        minRating: activeFilters.minRating ? parseInt(activeFilters.minRating) : undefined,
        brands: activeFilters.brands.length ? [...activeFilters.brands].sort() : undefined,
        sort: activeFilters.sort,
        page: 1,
        perPage: 12,
      };
      
      console.log('Fetching products with params:', JSON.stringify(params, null, 2));
      
      const response = await productApi.getProducts(params);
      console.log('API Response:', JSON.stringify(response, null, 2));
      return response;
    } catch (err: any) {
      console.error('Error fetching products:', err);
      const errorMessage = err.message || 'Failed to load products';
      toast.error('Error', {
        description: errorMessage
      });
      throw new Error(errorMessage);
    }
  }, [activeFilters]);

  // Fetch products with filters (without sorting)
  // Fetch categories from the backend
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await productApi.getCategories();
        return response || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products with filters
  const { 
    data: productsResponse = { products: [], total: 0 }, 
    isLoading, 
    error, 
    isError, 
    refetch,
    isRefetching,
    isPlaceholderData
  } = useQuery({
    queryKey: [
      'products',
      activeFilters.search || '',
      [...activeFilters.categories].sort().join(','),
      activeFilters.priceRange || '',
      activeFilters.minRating || '',
      [...activeFilters.brands].sort().join(',')
    ],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused/inactive data in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
  
  // Apply sorting to the products on the frontend
  const { products: sortedProducts = [], total = 0 } = useMemo(() => {
    if (!productsResponse.products.length) return { products: [], total: 0 };
    
    let result = [...productsResponse.products];
    
    // Apply sorting based on activeFilters.sort
    switch (activeFilters.sort) {
      case 'price-low-high':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high-low':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // Default sorting (featured items first, then by newest)
        result.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }
    
    return { products: result, total: productsResponse.total };
  }, [productsResponse, activeFilters.sort]);

  const handleFilterChange = (filterType: string, value: string | number, isChecked: boolean) => {
    setActiveFilters(prev => {
      if (filterType === 'categories' || filterType === 'brands') {
        const currentValues = [...prev[filterType]] as string[];
        const stringValue = String(value);
        if (isChecked) {
          currentValues.push(stringValue);
        } else {
          const index = currentValues.indexOf(stringValue);
          if (index > -1) {
            currentValues.splice(index, 1);
          }
        }
        return { ...prev, [filterType]: currentValues };
      } else {
        return { ...prev, [filterType]: isChecked ? String(value) : '' };
      }
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: '',
      minRating: '',
      brands: [],
      search: '',
      sort: 'featured',
    });
  };

  const activeFilterCount = [
    activeFilters.categories.length,
    activeFilters.priceRange ? 1 : 0,
    activeFilters.minRating ? 1 : 0,
    activeFilters.brands.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-background">
      <div>
        {/* Mobile filter dialog */}
        <div className="lg:hidden">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-border pb-6 pt-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Shop</h1>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 h-10 rounded-full border-2 bg-muted/50 focus:bg-background w-64"
                    value={activeFilters.search}
                    onChange={(e) => 
                      setActiveFilters(prev => ({ ...prev, search: e.target.value }))
                    }
                  />
                </div>
              </div>
              
              <div className="ml-4">
                <select
                  id="sort"
                  name="sort"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={activeFilters.sort}
                  onChange={(e) => {
                    // Only update the sort value, no need to refetch
                    setActiveFilters(prev => ({
                      ...prev,
                      sort: e.target.value
                    }));
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <div className="space-y-6 border-r border-border pr-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Filters</h2>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:text-primary/80"
                        onClick={clearAllFilters}
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="border-b border-border pb-6">
                    <h3 className="-my-3 flow-root">
                      <div className="flex w-full items-center justify-between bg-background py-3 text-sm text-muted-foreground hover:text-foreground">
                        <span className="font-medium">Categories</span>
                      </div>
                    </h3>
                    <div className="pt-4">
                      <div className="space-y-2">
                        {isLoadingCategories ? (
                          // Skeleton loader for categories
                          Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                            </div>
                          ))
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <div key={category.slug} className="flex items-center">
                              <Checkbox
                                id={`category-${category.slug}`}
                                checked={activeFilters.categories.includes(category.slug)}
                                onCheckedChange={(checked) => 
                                  handleFilterChange('categories', category.slug, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`category-${category.slug}`}
                                className="ml-3 text-sm text-muted-foreground"
                              >
                                {category.name} 
                                {category.products_count !== undefined && (
                                  <span className="text-xs text-muted-foreground/60">
                                    ({category.products_count})
                                  </span>
                                )}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No categories found</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="border-b border-border pb-6">
                    <h3 className="-my-3 flow-root">
                      <div className="flex w-full items-center justify-between bg-background py-3 text-sm text-muted-foreground hover:text-foreground">
                        <span className="font-medium">Price Range</span>
                      </div>
                    </h3>
                    <div className="pt-4">
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <div key={range.id} className="flex items-center">
                            <Checkbox
                              id={`price-${range.id}`}
                              checked={activeFilters.priceRange === range.id}
                              onCheckedChange={(checked) => 
                                handleFilterChange('priceRange', range.id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`price-${range.id}`}
                              className="ml-3 text-sm text-muted-foreground"
                            >
                              {range.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customer Rating */}
                  <div className="border-b border-border pb-6">
                    <h3 className="-my-3 flow-root">
                      <div className="flex w-full items-center justify-between bg-background py-3 text-sm text-muted-foreground hover:text-foreground">
                        Showing <span className="font-medium">{Math.min(productsResponse.products.length, 12)}</span> of <span className="font-medium">{productsResponse.total}</span> products
                      </div>
                    </h3>
                    <div className="pt-4">
                      <div className="space-y-2">
                        {ratings.map((rating) => (
                          <div key={rating.id} className="flex items-center">
                            <Checkbox
                              id={`rating-${rating.id}`}
                              checked={activeFilters.minRating === rating.id}
                              onCheckedChange={(checked) => 
                                handleFilterChange('minRating', rating.id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`rating-${rating.id}`}
                              className="ml-3 flex items-center text-sm text-muted-foreground"
                            >
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= rating.value ? 'text-yellow-400' : 'text-muted-foreground/30'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1">& Up</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="border-b border-border pb-6">
                    <h3 className="-my-3 flow-root">
                      <div className="flex w-full items-center justify-between bg-background py-3 text-sm text-muted-foreground hover:text-foreground">
                        <span className="font-medium">Brands</span>
                      </div>
                    </h3>
                    <div className="pt-4">
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex items-center">
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={activeFilters.brands.includes(brand.id)}
                              onCheckedChange={(checked) => 
                                handleFilterChange('brands', brand.id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`brand-${brand.id}`}
                              className="ml-3 text-sm text-muted-foreground"
                            >
                              {brand.name} <span className="text-xs text-muted-foreground/60">({brand.count})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {isError && (
                <div className="lg:col-span-3 p-6 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Error loading products</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error?.message || 'Failed to load products. Please try again later.'}</p>
                        
                        {/* Show retry button */}
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                            className="inline-flex items-center gap-2"
                          >
                            {isRefetching ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              'Retry'
                            )}
                          </Button>
                        </div>
                        
                        {/* Debug info - only show in development */}
                        {process.env.NODE_ENV === 'development' && (
                          <details className="mt-4">
                            <summary className="text-xs font-medium text-red-600 cursor-pointer">
                              Show error details
                            </summary>
                            <div className="mt-2 p-3 bg-white rounded border border-red-100 overflow-auto max-h-40 text-xs">
                              <pre className="whitespace-pre-wrap break-words">
                                {JSON.stringify({
                                  message: error?.message,
                                  stack: error?.stack,
                                  name: error?.name,
                                  ...(error as any)?.response?.data
                                }, null, 2)}
                              </pre>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Debug info - only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                    <div className="font-medium text-gray-700 mb-1">Debug Info:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>API URL: <code>http://localhost:8084/api/products</code></div>
                      <div>Search Params: <code>{searchParams.toString()}</code></div>
                      <div className="col-span-2">
                        <button 
                          onClick={() => console.log('Current products data:', productsResponse)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Log products data to console
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Active filters */}
                {activeFilterCount > 0 && (
                  <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Active filters:</span>
                      
                      {/* Category filters */}
                      {activeFilters.categories.map((categorySlug) => {
                        const category = categories.find(c => c.slug === categorySlug);
                        if (!category) return null;
                        
                        return (
                          <span
                            key={`cat-${categorySlug}`}
                            className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
                          >
                            {category.name}
                            <button
                              type="button"
                              className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                              onClick={() => handleFilterChange('categories', categorySlug, false)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                      
                      {/* Price range filter */}
                      {activeFilters.priceRange && (
                        <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
                          {priceRanges.find(p => p.id === activeFilters.priceRange)?.name}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => handleFilterChange('priceRange', '', false)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      
                      {/* Min rating filter */}
                      {activeFilters.minRating && (
                        <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
                          {ratings.find(r => r.id === activeFilters.minRating)?.name} Stars
                          <button
                            type="button"
                            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => handleFilterChange('minRating', '', false)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      
                      {/* Brand filters */}
                      {activeFilters.brands.map((brandId) => {
                        const brand = brands.find(b => b.id === brandId);
                        if (!brand) return null;
                        
                        return (
                          <span
                            key={`brand-${brandId}`}
                            className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
                          >
                            {brand.name}
                            <button
                              type="button"
                              className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                              onClick={() => handleFilterChange('brands', brandId, false)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                      
                      <button
                        type="button"
                        className="ml-auto text-sm font-medium text-primary hover:text-primary/80"
                        onClick={clearAllFilters}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                  <div className="lg:col-span-3">
                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary/60 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="h-6 w-6 text-primary animate-spin-slow" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-foreground">Loading Products</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Finding the best deals for you...
                        </p>
                      </div>
                    </div>
                    
                    {/* Skeleton grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                          <div className="h-64 rounded-lg bg-muted/30 animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted/30 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse"></div>
                            <div className="h-6 bg-muted/30 rounded w-1/4 mt-2 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : sortedProducts && sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="lg:col-span-3">
                    <div className="flex flex-col items-center justify-center space-y-4 py-16 px-4 text-center">
                      <div className="rounded-full bg-muted/50 p-4">
                        <svg
                          className="mx-auto h-12 w-12 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                          />
                        </svg>
                      </div>
                      <div className="max-w-md">
                        <h3 className="text-lg font-medium text-foreground">No products found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          We couldn't find any products matching your search and filters.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Try adjusting your search or filter criteria to find what you're looking for.
                        </p>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          className="inline-flex items-center gap-1.5"
                        >
                          <X className="h-4 w-4" />
                          Clear all filters
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => {
                            setActiveFilters({
                              categories: [],
                              priceRange: '',
                              minRating: '',
                              brands: [],
                              search: '',
                              sort: 'featured',
                            });
                            document.getElementById('search-input')?.focus();
                          }}
                        >
                          Browse all products
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile filter dialog */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/25" onClick={() => setMobileFiltersOpen(false)} />
        <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-background py-4 pb-12 shadow-xl">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Filters */}
          <form className="mt-4">
            <ScrollArea className="h-[calc(100vh-8rem)] px-4">
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <div className="flex w-full items-center justify-between bg-background px-2 py-3 text-sm text-muted-foreground">
                      <span className="font-medium">Categories</span>
                    </div>
                  </h3>
                  <div className="pt-4">
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.slug} className="flex items-center">
                          <Checkbox
                            id={`mobile-category-${category.slug}`}
                            checked={activeFilters.categories.includes(category.slug)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('categories', category.slug, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`mobile-category-${category.id}`}
                            className="ml-3 text-sm text-muted-foreground"
                          >
                            {category.name} 
                            {category.products_count !== undefined && (
                              <span className="text-xs text-muted-foreground/60">
                                ({category.products_count})
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <div className="flex w-full items-center justify-between bg-background px-2 py-3 text-sm text-muted-foreground">
                      <span className="font-medium">Price Range</span>
                    </div>
                  </h3>
                  <div className="pt-4">
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <div key={range.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-price-${range.id}`}
                            checked={activeFilters.priceRange === range.id}
                            onCheckedChange={(checked) => 
                              handleFilterChange('priceRange', range.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`mobile-price-${range.id}`}
                            className="ml-3 text-sm text-muted-foreground"
                          >
                            {range.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Rating */}
                <div>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <div className="flex w-full items-center justify-between bg-background px-2 py-3 text-sm text-muted-foreground">
                      <span className="font-medium">Customer Rating</span>
                    </div>
                  </h3>
                  <div className="pt-4">
                    <div className="space-y-2">
                      {ratings.map((rating) => (
                        <div key={rating.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-rating-${rating.id}`}
                            checked={activeFilters.minRating === rating.id}
                            onCheckedChange={(checked) => 
                              handleFilterChange('minRating', rating.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`mobile-rating-${rating.id}`}
                            className="ml-3 flex items-center text-sm text-muted-foreground"
                          >
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= rating.value ? 'text-yellow-400' : 'text-muted-foreground/30'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1">& Up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <div className="flex w-full items-center justify-between bg-background px-2 py-3 text-sm text-muted-foreground">
                      <span className="font-medium">Brands</span>
                    </div>
                  </h3>
                  <div className="pt-4">
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-brand-${brand.id}`}
                            checked={activeFilters.brands.includes(brand.id)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('brands', brand.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`mobile-brand-${brand.id}`}
                            className="ml-3 text-sm text-muted-foreground"
                          >
                            {brand.name} <span className="text-xs text-muted-foreground/60">({brand.count})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-border px-4 py-4">
              <Button
                type="button"
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
