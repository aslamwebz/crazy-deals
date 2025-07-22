<?php

namespace App\Http\Controllers\API;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderCollection;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = Order::with(['items', 'shippingAddress', 'billingAddress'])
            ->where('user_id', Auth::id())
            ->latest();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(10);
        return new OrderCollection($orders);
    }

    public function store(StoreOrderRequest $request)
    {
        // Start transaction
        return \DB::transaction(function () use ($request) {
            // Create or get addresses
            $shippingAddress = $this->getOrCreateAddress($request->shipping_address);
            $billingAddress = $request->has('billing_address') 
                ? $this->getOrCreateAddress($request->billing_address)
                : $shippingAddress;

            // Calculate order total
            $orderData = $this->calculateOrderTotals($request->items);
            
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'status' => 'pending',
                'subtotal' => $orderData['subtotal'],
                'tax_amount' => $orderData['tax_amount'],
                'shipping_amount' => $request->shipping_amount ?? 0,
                'discount_amount' => $request->discount_amount ?? 0,
                'total' => $orderData['subtotal'] + $orderData['tax_amount'] + ($request->shipping_amount ?? 0) - ($request->discount_amount ?? 0),
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_method' => $request->shipping_method,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'notes' => $request->notes,
            ]);

            // Create order items and update product quantities
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $productItem = $product->items()->find($item['product_item_id'] ?? null);
                
                $orderItem = new OrderItem([
                    'product_id' => $product->id,
                    'product_item_id' => $productItem->id ?? null,
                    'product_name' => $product->name,
                    'product_price' => $productItem->price ?? $product->price,
                    'quantity' => $item['quantity'],
                    'options' => $item['options'] ?? null,
                ]);
                
                $order->items()->save($orderItem);

                // Update product quantity
                if ($productItem) {
                    $productItem->decrement('quantity', $item['quantity']);
                } else {
                    $product->decrement('quantity', $item['quantity']);
                }
            }

            // Process payment here (would integrate with payment gateway)
            // $this->processPayment($order, $request->payment_method);

            return new OrderResource($order->load('items', 'shippingAddress', 'billingAddress'));
        });
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        
        return new OrderResource($order->load('items', 'shippingAddress', 'billingAddress'));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        
        $order->update($request->validated());
        
        return new OrderResource($order->load('items', 'shippingAddress', 'billingAddress'));
    }

    public function cancel(Order $order)
    {
        $this->authorize('update', $order);
        
        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json([
                'message' => 'Order cannot be cancelled in its current state'
            ], 422);
        }
        
        // Restore product quantities
        foreach ($order->items as $item) {
            if ($item->productItem) {
                $item->productItem->increment('quantity', $item->quantity);
            } else {
                $item->product->increment('quantity', $item->quantity);
            }
        }
        
        $order->update(['status' => 'cancelled']);
        
        return new OrderResource($order);
    }

    protected function getOrCreateAddress(array $addressData)
    {
        if (isset($addressData['id'])) {
            return UserAddress::where('id', $addressData['id'])
                ->where('user_id', Auth::id())
                ->firstOrFail();
        }
        
        return Auth::user()->addresses()->create($addressData);
    }
    
    protected function calculateOrderTotals(array $items)
    {
        $subtotal = 0;
        $taxRate = 0.1; // 10% tax rate, adjust as needed
        
        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $productItem = $product->items()->find($item['product_item_id'] ?? null);
            $price = $productItem->price ?? $product->price;
            $subtotal += $price * $item['quantity'];
            
            // Check if there's enough quantity
            $availableQty = $productItem ? $productItem->quantity : $product->quantity;
            if ($availableQty < $item['quantity']) {
                throw new \Exception("Not enough quantity available for product: {$product->name}");
            }
        }
        
        $taxAmount = $subtotal * $taxRate;
        
        return [
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $subtotal + $taxAmount
        ];
    }
}
