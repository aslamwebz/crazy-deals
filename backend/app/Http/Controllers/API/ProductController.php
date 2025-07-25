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
            ->where('status', 'active');

        // Filter by categories (array of category slugs)
        if ($request->has('categories') && !empty($request->categories)) {
            $categorySlugs = array_filter(explode(',', $request->categories));
            if (!empty($categorySlugs)) {
                $query->whereHas('category', function($q) use ($categorySlugs) {
                    $q->whereIn('slug', $categorySlugs);
                });
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Filter by price range
        if ($request->has('price_range')) {
            $priceRange = $request->price_range;
            $ranges = [
                '0-50' => [0, 50],
                '50-100' => [50, 100],
                '100-200' => [100, 200],
                '200-500' => [200, 500],
                '500-1000' => [500, 1000],
                '1000' => [1000, PHP_FLOAT_MAX],
            ];

            if (isset($ranges[$priceRange])) {
                list($min, $max) = $ranges[$priceRange];
                $query->whereHas('defaultItem', function($q) use ($min, $max) {
                    $q->where('price', '>=', $min);
                    if ($max !== PHP_FLOAT_MAX) {
                        $q->where('price', '<=', $max);
                    }
                });
            }
        }

        // Filter by minimum rating
        if ($request->has('min_rating')) {
            $minRating = (float) $request->min_rating;
            $query->where('rating', '>=', $minRating);
        }

        // Filter by brands
        if ($request->has('brands')) {
            $brands = explode(',', $request->brands);
            $query->whereIn('brand_slug', $brands);
        }

        // Sorting
        $sortBy = $request->input('sort', 'created_at');
        $sortOrder = 'desc';
        
        if (str_contains($sortBy, '-')) {
            list($sortBy, $sortOrder) = explode('-', $sortBy);
        }
        
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
        
        switch ($sortBy) {
            case 'price':
                $query->select('products.*')
                    ->join('product_items as pi', 'products.default_item_id', '=', 'pi.id')
                    ->orderBy('pi.price', $sortOrder);
                break;
            case 'rating':
                $query->orderBy('rating', $sortOrder);
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
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
