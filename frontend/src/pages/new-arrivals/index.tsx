import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Star, ShoppingCart, Heart } from 'lucide-react';

export default function NewArrivalsPage() {
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
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Arrivals</h1>
        <p className="text-muted-foreground">Discover our latest products just for you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                <span className="text-5xl">
                  {['📱', '👕', '👟', '🎧', '💻', '⌚', '🛋️', '🍽️'][item - 1]}
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                New
              </div>
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                <button className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium group-hover:text-primary">
                  <Link to="/products/sample-product">
                    New Product {item}
                  </Link>
                </h3>
                <span className="font-bold">${(99 + item * 10).toFixed(2)}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {[
                  'Latest model with advanced features',
                  'Premium quality material',
                  'Eco-friendly and sustainable',
                  'Smart technology enabled',
                  'Ergonomic design',
                  'Wireless connectivity',
                  'Long battery life',
                  'Compact and portable'
                ][item - 1]}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${star <= (item % 5 || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span>({item * 3} reviews)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">In Stock</span>
                <span className="text-xs text-muted-foreground">Added {item} day{item !== 1 ? 's' : ''} ago</span>
              </div>
              
              <Button className="w-full mt-3" size="sm" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="px-8">
          Load More
        </Button>
      </div>
    </div>
  );
}
