<?php

namespace App\Http\Controllers\API;

use App\Models\Wishlist;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Http\Resources\WishlistCollection;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $wishlistItems = Auth::user()->wishlist()
            ->with(['product' => function($query) {
                $query->with(['images', 'defaultItem']);
            }])
            ->latest()
            ->paginate(10);

        return new WishlistCollection($wishlistItems);
    }

    public function store(Product $product)
    {
        // Check if product is already in wishlist
        $existing = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Product is already in your wishlist'
            ], 422);
        }

        $wishlistItem = Auth::user()->wishlist()->create([
            'product_id' => $product->id
        ]);

        return new WishlistResource($wishlistItem->load('product.images', 'product.defaultItem'));
    }

    public function destroy(Product $product)
    {
        $wishlistItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->firstOrFail();

        $wishlistItem->delete();

        return response()->noContent();
    }

    public function clear()
    {
        Auth::user()->wishlist()->delete();
        return response()->noContent();
    }
}
