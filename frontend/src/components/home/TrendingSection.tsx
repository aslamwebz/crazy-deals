import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Zap, Star } from 'lucide-react';

const TrendingSection = () => {
  const trendingItems = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      price: 79.99,
      originalPrice: 199.99,
      sales: "2.1k sold today",
      trending: "+234%"
    },
    {
      id: 2,
      name: "Smart Watch Ultra",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      price: 199.99,
      originalPrice: 399.99,
      sales: "1.8k sold today",
      trending: "+189%"
    },
    {
      id: 3,
      name: "Gaming Headset RGB",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
      price: 89.99,
      originalPrice: 249.99,
      sales: "956 sold today",
      trending: "+167%"
    },
    {
      id: 4,
      name: "Smartphone Camera Lens",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
      price: 49.99,
      originalPrice: 129.99,
      sales: "1.2k sold today",
      trending: "+145%"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-red-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full">
              <Flame className="h-5 w-5 mr-2 animate-bounce" />
              <span className="font-bold">TRENDING NOW</span>
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4">
            What's <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Flying Off</span> Our Shelves
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These hot deals are selling fast! Join thousands of smart shoppers who've already grabbed these amazing bargains.
          </p>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingItems.map((item, index) => (
            <div 
              key={item.id}
              className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-200 dark:border-orange-800 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Trending Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold animate-pulse">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {item.trending}
                </Badge>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-black text-green-600">${item.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                    </div>
                    <p className="text-xs text-orange-600 font-semibold">{item.sales}</p>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl">
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Grab Deal
                </Button>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Happy Customers", value: "50K+", icon: "😊" },
            { label: "Products Sold", value: "1M+", icon: "📦" },
            { label: "Average Rating", value: "4.9/5", icon: "⭐" },
            { label: "Countries", value: "25+", icon: "🌍" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/50 dark:bg-card/50 rounded-xl backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-orange-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
            <Star className="h-5 w-5 mr-2 animate-spin" />
            View All Trending Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
