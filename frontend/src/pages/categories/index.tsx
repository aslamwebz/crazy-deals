import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CategoriesPage() {
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
      
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { name: 'Electronics', count: 156, icon: '📱' },
          { name: 'Fashion', count: 289, icon: '👕' },
          { name: 'Home & Garden', count: 124, icon: '🏠' },
          { name: 'Beauty', count: 98, icon: '💄' },
          { name: 'Toys & Games', count: 76, icon: '🎮' },
          { name: 'Sports & Outdoors', count: 112, icon: '⚽' },
          { name: 'Books', count: 203, icon: '📚' },
          { name: 'Health', count: 87, icon: '❤️' },
        ].map((category) => (
          <Link 
            key={category.name}
            to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{category.icon}</div>
              <div>
                <h3 className="font-medium text-lg group-hover:text-primary">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
