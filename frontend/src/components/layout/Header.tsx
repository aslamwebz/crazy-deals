import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X, Zap, Filter, LogIn, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CartIcon } from '../cart/CartIcon';
import { WishlistIcon } from '../wishlist/WishlistIcon';
import { productApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Define the category type
interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  is_active: boolean;
  order: number;
  trending?: boolean;
  description?: string;
}

// Default categories that will be shown while loading
const defaultCategories: CategoryItem[] = [
  { 
    id: 1,
    name: 'Loading...',
    slug: 'loading',
    icon: '⏳',
    color: 'from-gray-200 to-gray-300',
    is_active: true,
    order: 1,
    trending: false,
    description: 'Loading categories...'
  }
];

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state

  // Fetch categories from the backend
  const { data: categories = defaultCategories, isLoading } = useQuery<CategoryItem[]>({
    queryKey: ['header-categories'],
    queryFn: async () => {
      try {
        const data = await productApi.getCategories();
        // Map the API response to match our expected format
        return data.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: getCategoryIcon(category.slug),
          trending: Math.random() > 0.7, // Randomly mark some as trending for demo
          description: category.description || `${category.name} products`,
          color: category.color || getDefaultColor(category.slug),
          is_active: category.is_active !== false, // Ensure boolean
          order: category.order || 99
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
        return defaultCategories;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper function to get an icon based on category slug
  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      electronics: '⚡',
      fashion: '👕',
      'home-garden': '🏠',
      beauty: '💄',
      sports: '⚽',
      books: '📚',
      default: '🛍️'
    };
    return icons[slug] || icons.default;
  };

  // Helper function to get a default color gradient based on slug
  const getDefaultColor = (slug: string) => {
    const colors: Record<string, string> = {
      electronics: 'from-blue-500 to-cyan-500',
      fashion: 'from-pink-500 to-rose-500',
      'home-garden': 'from-emerald-500 to-teal-500',
      beauty: 'from-purple-500 to-fuchsia-500',
      sports: 'from-orange-500 to-amber-500',
      books: 'from-indigo-500 to-violet-500',
      default: 'from-gray-500 to-slate-500'
    };
    return colors[slug] || colors.default;
  };

  // Sort categories by order and filter out inactive ones
  const sortedCategories = [...categories]
    .filter((category): category is CategoryItem => category.is_active !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-lg">
      {/* Flash banner */}
      <div className="bg-gradient-to-r from-destructive via-red-500 to-orange-500 text-white text-center py-1.5 text-xs font-bold relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        <div className="relative flex items-center justify-center gap-1.5">
          <Zap className="h-3 w-3 animate-bounce" />
          <span className="text-[0.7rem]">🔥 MEGA FLASH SALE: Up to 90% OFF - Limited Time!</span>
          <Zap className="h-3 w-3 animate-bounce" />
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with custom design */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative">
                <Menu className={`h-6 w-6 transition-transform ${isMobileMenuOpen ? 'rotate-45 opacity-0' : ''}`} />
                <X className={`h-6 w-6 absolute inset-0 transition-transform ${isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}`} />
              </div>
            </Button>
            
            <Link to="/" className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-destructive to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <h1 className="relative text-2xl font-black bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
                Crazy<span className="text-foreground">Deals</span>
              </h1>
            </Link>
          </div>

          {/* Enhanced search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex">
                <Input 
                  placeholder="Search 1M+ products, brands, deals..."
                  className="pl-10 pr-16 h-10 text-sm rounded-full border-2 bg-muted/50 focus:bg-background transition-all"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <div className="absolute right-1.5 top-1.5">
                  <Button size="sm" className="rounded-full h-7 px-2 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons with animations */}
          <div className="flex items-center space-x-2">
            <CartIcon />
            <WishlistIcon />
            
            {/* User Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:scale-110 transition-transform relative"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border overflow-hidden z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium">Welcome back</p>
                        <p className="text-sm text-muted-foreground truncate">user@example.com</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/account/orders" 
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShoppingBag className="mr-3 h-5 w-5 text-muted-foreground" />
                          My Orders
                        </Link>
                        <Link 
                          to="/account/wishlist" 
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="mr-3 h-5 w-5 text-muted-foreground" />
                          Wishlist
                        </Link>
                        <Link 
                          to="/account/settings" 
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
                          Account Settings
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50 flex items-center"
                          onClick={() => {
                            setIsLoggedIn(false);
                            setIsUserMenuOpen(false);
                            // TODO: Add logout logic
                          }}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link 
                        to="/login" 
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LogIn className="mr-3 h-5 w-5 text-muted-foreground" />
                        Sign in
                      </Link>
                      <Link 
                        to="/register" 
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5 text-muted-foreground" />
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced navigation - Reduced padding */}
        <nav className="hidden md:flex items-center justify-between py-2 border-t">
          <div className="flex items-center space-x-0.5">
            {isLoading ? (
              // Skeleton loaders while categories are loading
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center px-3 py-1.5">
                  <Skeleton className="h-5 w-5 rounded-full mr-1.5" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              // Render actual categories when loaded
              sortedCategories.map((item, index) => (
                <Link 
                  key={item.slug}
                  to={`/shop?categories=${item.slug}`}
                  className={cn(
                    "relative group px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center",
                    "hover:bg-muted/40"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="mr-1.5 text-base">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.trending && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-0"></div>
                    </div>
                  )}
                  <div className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r transition-all duration-200 group-hover:w-full",
                    item.color
                  )}></div>
                </Link>
              ))
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free Shipping $50+</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </nav>

        {/* Mobile search */}
        <div className="md:hidden py-4 border-t">
          <div className="relative">
            <Input 
              placeholder="Search deals..."
              className="pl-10 pr-4 h-10 rounded-full bg-muted/50"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 pt-24"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="bg-background border-t border-border overflow-y-auto h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6">
              <h3 className="text-lg font-semibold mb-4 px-2">Shop by Category</h3>
              <div className="grid grid-cols-1 gap-2">
                {isLoading ? (
                  // Skeleton loaders for mobile menu
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg">
                      <Skeleton className="w-10 h-10 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))
                ) : (
                  // Render actual categories when loaded
                  sortedCategories.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/shop?categories=${item.slug}`}
                      className="flex items-center p-4 rounded-lg hover:bg-muted/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                        `bg-gradient-to-br ${item.color} text-white`
                      )}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{item.name}</span>
                          {item.trending && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Hot
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-5 h-5 text-muted-foreground ml-auto"
                      >
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </Link>
                  ))
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 px-2">Customer Service</h3>
                <div className="space-y-2">
                  <Link
                    to="/contact"
                    className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-muted-foreground">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Contact Us
                  </Link>
                  <Link
                    to="/faq"
                    className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-muted-foreground">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                    Help & FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
