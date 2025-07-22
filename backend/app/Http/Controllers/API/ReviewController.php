<?php

namespace App\Http\Controllers\API;

use App\Models\Review;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\ReviewCollection;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        $reviews = $product->reviews()
            ->where('is_approved', true)
            ->with('user', 'images')
            ->latest()
            ->paginate(10);

        return new ReviewCollection($reviews);
    }

    public function store(StoreReviewRequest $request, Product $product)
    {
        // Check if user has purchased the product
        $hasPurchased = $product->orderItems()
            ->whereHas('order', function($query) {
                $query->where('user_id', Auth::id())
                      ->whereIn('status', ['delivered', 'completed']);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'You must purchase the product before leaving a review'
            ], 403);
        }

        // Check if user has already reviewed this product
        $existingReview = $product->reviews()
            ->where('user_id', Auth::id())
            ->exists();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $data['product_id'] = $product->id;
        $data['is_approved'] = false; // Default to false, admin needs to approve

        $review = Review::create($data);

        // Handle review images
        if ($request->has('images')) {
            foreach ($request->images as $image) {
                $review->images()->create([
                    'url' => $image['url']
                ]);
            }
        }

        // Update product rating
        $this->updateProductRating($product);

        return new ReviewResource($review->load('user', 'images'));
    }

    public function show(Review $review)
    {
        return new ReviewResource($review->load('user', 'images'));
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        $this->authorize('update', $review);

        $review->update($request->validated());

        // Handle review images update
        if ($request->has('images')) {
            $review->images()->delete();
            foreach ($request->images as $image) {
                $review->images()->create([
                    'url' => $image['url']
                ]);
            }
        }

        // Update product rating
        $this->updateProductRating($review->product);

        return new ReviewResource($review->load('user', 'images'));
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        
        $product = $review->product;
        $review->delete();

        // Update product rating
        $this->updateProductRating($product);

        return response()->noContent();
    }

    public function approve(Review $review)
    {
        $this->authorize('approve', $review);

        $review->update(['is_approved' => true]);
        $this->updateProductRating($review->product);

        return new ReviewResource($review);
    }

    protected function updateProductRating(Product $product)
    {
        $rating = $product->reviews()
            ->where('is_approved', true)
            ->avg('rating');

        $product->update(['rating' => $rating]);
    }
}
