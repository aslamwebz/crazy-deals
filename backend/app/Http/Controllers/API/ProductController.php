<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'defaultItem'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->per_page ?? 15;
        $products = $query->paginate($perPage);

        return new ProductCollection($products);
    }

    public function featured()
    {
        $products = Product::with(['category', 'images', 'defaultItem'])
            ->where('is_featured', true)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return new ProductCollection($products);
    }

    public function trending()
    {
        $products = Product::with(['category', 'images', 'defaultItem'])
            ->where('is_trending', true)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return new ProductCollection($products);
    }

    public function flashDeals()
    {
        $now = now();
        
        $products = Product::with(['category', 'images', 'defaultItem'])
            ->where('is_flash_deal', true)
            ->where('status', 'active')
            ->where('flash_deal_starts_at', '<=', $now)
            ->where('flash_deal_ends_at', '>=', $now)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return new ProductCollection($products);
    }

    public function show($identifier)
    {
        $product = Product::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();
            
        $product->load([
            'category',
            'images',
            'variants',
            'items',
            'reviews' => function($query) {
                $query->where('is_approved', true)
                      ->with('user')
                      ->latest();
            }
        ]);

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        
        // Handle product creation with variants and images
        $product = Product::create($data);
        
        // Handle images
        if ($request->has('images')) {
            foreach ($request->images as $image) {
                $product->images()->create([
                    'url' => $image['url'],
                    'is_primary' => $image['is_primary'] ?? false,
                    'order' => $image['order'] ?? 0,
                ]);
            }
        }
        
        // Handle variants
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                $product->variants()->create([
                    'name' => $variant['name'],
                    'values' => $variant['values']
                ]);
            }
        }
        
        // Handle product items
        if ($request->has('items')) {
            foreach ($request->items as $item) {
                $product->items()->create([
                    'sku' => $item['sku'],
                    'price' => $item['price'] ?? null,
                    'compare_at_price' => $item['compare_at_price'] ?? null,
                    'quantity' => $item['quantity'] ?? 0,
                    'barcode' => $item['barcode'] ?? null,
                    'weight' => $item['weight'] ?? null,
                    'options' => $item['options'] ?? null,
                    'is_default' => $item['is_default'] ?? false,
                ]);
            }
        }

        return new ProductResource($product->load(['category', 'images', 'variants', 'items']));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $product->update($data);

        // Handle images update if needed
        if ($request->has('images')) {
            $product->images()->delete();
            foreach ($request->images as $image) {
                $product->images()->create([
                    'url' => $image['url'],
                    'is_primary' => $image['is_primary'] ?? false,
                    'order' => $image['order'] ?? 0,
                ]);
            }
        }

        // Handle variants update if needed
        if ($request->has('variants')) {
            $product->variants()->delete();
            foreach ($request->variants as $variant) {
                $product->variants()->create([
                    'name' => $variant['name'],
                    'values' => $variant['values']
                ]);
            }
        }

        // Handle product items update if needed
        if ($request->has('items')) {
            $product->items()->delete();
            foreach ($request->items as $item) {
                $product->items()->create([
                    'sku' => $item['sku'],
                    'price' => $item['price'] ?? null,
                    'compare_at_price' => $item['compare_at_price'] ?? null,
                    'quantity' => $item['quantity'] ?? 0,
                    'barcode' => $item['barcode'] ?? null,
                    'weight' => $item['weight'] ?? null,
                    'options' => $item['options'] ?? null,
                    'is_default' => $item['is_default'] ?? false,
                ]);
            }
        }

        return new ProductResource($product->load(['category', 'images', 'variants', 'items']));
    }

    public function destroy(Product $product)
    {
        // Check if product has orders
        if ($product->orderItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product with existing orders'
            ], 422);
        }

        $product->delete();
        return response()->noContent();
    }
}
