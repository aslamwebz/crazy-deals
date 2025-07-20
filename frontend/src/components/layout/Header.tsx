
import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, Zap, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Electronics', icon: '⚡', trending: true },
    { name: 'Fashion', icon: '👕', trending: false },
    { name: 'Home & Garden', icon: '🏠', trending: false },
    { name: 'Beauty', icon: '💄', trending: true },
    { name: 'Sports', icon: '⚽', trending: false },
    { name: 'Books', icon: '📚', trending: false }
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
            <Button variant="ghost" size="icon" className="relative group hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative group hover:scale-110 transition-transform">
              <ShoppingCart className="h-6 w-6 group-hover:animate-bounce" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-green-500 to-blue-500 animate-pulse">
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Enhanced navigation */}
        <nav className="hidden md:flex items-center justify-between py-4 border-t">
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Button 
                key={item.name} 
                variant="ghost" 
                className="relative group hover:bg-gradient-to-r hover:from-muted to-transparent rounded-xl px-4 py-2 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-2 text-lg">{item.icon}</span>
                {item.name}
                {item.trending && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0"></div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-destructive to-orange-500 group-hover:w-full transition-all duration-300"></div>
              </Button>
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item) => (
                <Button key={item.name} variant="ghost" className="justify-start h-12">
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.trending && <Badge className="ml-auto text-xs">Hot</Badge>}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
