import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Zap, Star, ShoppingCart, Heart } from 'lucide-react';

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/" className="flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hot Deals</h1>
          <p className="text-muted-foreground">Limited time offers you don't want to miss</p>
        </div>
        <div className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="h-4 w-4 mr-2 animate-pulse" fill="currentColor" />
          <span>Ending soon</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((deal) => (
          <div key={deal} className="border rounded-xl overflow-hidden group">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-4xl">🛍️</span>
              </div>
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {50 + deal * 5}% OFF
              </div>
              <div className="absolute top-3 right-3">
                <button className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium group-hover:text-primary">
                  <Link to="/products/sample-product">
                    Premium Product {deal}
                  </Link>
                </h3>
                <div className="text-right">
                  <span className="font-bold">${(100 - deal * 10).toFixed(2)}</span>
                  <span className="block text-xs text-muted-foreground line-through">${(200 - deal * 5).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span>({42 + deal})</span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" 
                    style={{ width: `${100 - deal * 5}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sold: {30 + deal * 5}</span>
                  <span>Available: {50 - deal * 5}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-xs bg-amber-50 text-amber-800 p-2 rounded">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Ends in: {24 - deal}h {60 - deal * 5}m</span>
              </div>
              
              <Button className="w-full mt-3" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
