import React, { useState } from 'react';
import { Search, User, Menu, X, Zap, Filter, LogIn, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CartIcon } from '../cart/CartIcon';
import { WishlistIcon } from '../wishlist/WishlistIcon';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state

  const navItems = [
    { 
      name: 'Electronics', 
      slug: 'electronics',
      icon: '⚡', 
      trending: true,
      description: 'Latest gadgets and electronics',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Fashion', 
      slug: 'fashion',
      icon: '👕', 
      trending: false,
      description: 'Trendy clothing and accessories',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Home & Garden', 
      slug: 'home-garden',
      icon: '🏠', 
      trending: false,
      description: 'Everything for your home',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'Beauty', 
      slug: 'beauty',
      icon: '💄', 
      trending: true,
      description: 'Beauty and personal care',
      color: 'from-purple-500 to-fuchsia-500'
    },
    { 
      name: 'Sports', 
      slug: 'sports',
      icon: '⚽', 
      trending: false,
      description: 'Sports equipment and apparel',
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Books', 
      slug: 'books',
      icon: '📚', 
      trending: false,
      description: 'Books and media',
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-lg">
      {/* Flash banner */}
      <div className="bg-gradient-to-r from-destructive via-red-500 to-orange-500 text-white text-center py-2 text-sm font-bold relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        <div className="relative flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 animate-bounce" />
          🔥 MEGA FLASH SALE: Up to 90% OFF - Limited Time Only!
          <Zap className="h-4 w-4 animate-bounce" />
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
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
            
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 bg-gradient-to-r from-destructive to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <h1 className="relative text-3xl font-black bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
                Crazy<span className="text-foreground">Deals</span>
              </h1>
            </div>
          </div>

          {/* Enhanced search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex">
                <Input 
                  placeholder="Search 1M+ products, brands, deals..."
                  className="pl-12 pr-20 h-12 rounded-full border-2 bg-muted/50 focus:bg-background transition-all"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <Button size="sm" className="rounded-full h-8 px-3">
                    <Filter className="h-4 w-4 mr-1" />
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
                <User className="h-6 w-6" />
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

        {/* Enhanced navigation */}
        <nav className="hidden md:flex items-center justify-between py-4 border-t">
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link 
                key={item.slug}
                to={`/shop?categories=${item.slug}`}
                className={cn(
                  "relative group px-4 py-2 rounded-xl transition-all duration-300 flex items-center",
                  "hover:bg-muted/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-2 text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {item.trending && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0"></div>
                  </div>
                )}
                <div className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r transition-all duration-300 group-hover:w-full",
                  item.color
                )}></div>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free Shipping $50+</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
                {navItems.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/shop?categories=${item.slug}`}
                    className={cn(
                      "flex items-center p-4 rounded-lg transition-colors",
                      "hover:bg-muted/50 border border-transparent hover:border-border"
                    )}
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
                      <p className="text-sm text-muted-foreground">{item.description}</p>
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
                      className="h-4 w-4 text-muted-foreground ml-2"
                    >
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Link>
                ))}
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
