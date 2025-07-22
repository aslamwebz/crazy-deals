<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class WishlistResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'product_id' => $this->product_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'price' => (float) $this->product->price,
                    'compare_at_price' => $this->product->compare_at_price ? (float) $this->product->compare_at_price : null,
                    'in_stock' => $this->product->in_stock,
                    'is_featured' => (bool) $this->product->is_featured,
                    'is_trending' => (bool) $this->product->is_trending,
                    'is_flash_deal' => (bool) $this->product->is_flash_deal,
                    'primary_image' => $this->product->primary_image,
                    'rating' => $this->product->rating ? (float) number_format($this->product->rating, 1) : null,
                    'reviews_count' => $this->product->reviews_count ?? 0,
                    'url' => route('products.show', $this->product->slug),
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),
        ];
    }

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        if ($this->wasRecentlyCreated) {
            return 'Product added to wishlist successfully.';
        }

        if ($this->wasRecentlyDeleted) {
            return 'Product removed from wishlist successfully.';
        }

        return null;
    }
}
