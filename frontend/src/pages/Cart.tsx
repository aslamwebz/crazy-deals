import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    itemCount, 
    total, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearCart}
          disabled={items.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 flex items-center space-x-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          <Link to={`/products/${item.slug}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 text-center">
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                      {item.compare_at_price > item.price && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          ${item.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="md:col-span-3 flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center justify-end space-x-4">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6" size="lg">
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                or{' '}
                <Link to="/" className="text-primary hover:underline">
                  continue shopping
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-sm mb-2">Secure Checkout</h3>
            <p className="text-xs text-muted-foreground">
              All transactions are secure and encrypted. We never store your payment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
