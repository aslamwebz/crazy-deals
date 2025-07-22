<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductResource extends BaseResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price ? (float) $this->compare_at_price : null,
            'cost_per_item' => $this->when($this->cost_per_item, (float) $this->cost_per_item),
            'quantity' => (int) $this->quantity,
            'stock_status' => $this->stock_status,
            'is_taxable' => (bool) $this->is_taxable,
            'is_featured' => (bool) $this->is_featured,
            'is_trending' => (bool) $this->is_trending,
            'is_flash_deal' => (bool) $this->is_flash_deal,
            'flash_deal_starts_at' => $this->when($this->is_flash_deal, $this->flash_deal_starts_at),
            'flash_deal_ends_at' => $this->when($this->is_flash_deal, $this->flash_deal_ends_at),
            'requires_shipping' => (bool) $this->requires_shipping,
            'weight' => $this->weight ? (float) $this->weight : null,
            'length' => $this->length ? (float) $this->length : null,
            'width' => $this->width ? (float) $this->width : null,
            'height' => $this->height ? (float) $this->height : null,
            'status' => $this->status,
            'rating' => $this->when($this->rating, (float) number_format($this->rating, 1)),
            'reviews_count' => $this->when(isset($this->reviews_count), (int) $this->reviews_count),
            'category_id' => $this->category_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'category' => $this->whenLoaded('category', function () {
                return new CategoryResource($this->category);
            }),
            'images' => $this->whenLoaded('images', function () {
                return ProductImageResource::collection($this->images);
            }),
            'variants' => $this->whenLoaded('variants', function () {
                return ProductVariantResource::collection($this->variants);
            }),
            'items' => $this->whenLoaded('items', function () {
                return ProductItemResource::collection($this->items);
            }),
            'reviews' => $this->whenLoaded('reviews', function () {
                return ReviewResource::collection($this->reviews);
            }),
            
            // Computed attributes
            'in_stock' => (bool) $this->in_stock,
            'discount_percentage' => $this->when($this->compare_at_price > $this->price, 
                round((($this->compare_at_price - $this->price) / $this->compare_at_price) * 100)
            ),
            'is_on_sale' => $this->compare_at_price > $this->price,
            'is_flash_deal_active' => $this->is_flash_deal && 
                                     $this->flash_deal_starts_at <= now() && 
                                     $this->flash_deal_ends_at >= now(),
            'url' => route('products.show', $this->slug),
            'primary_image' => $this->when($this->relationLoaded('images') && $this->images->isNotEmpty(), function () {
                $primary = $this->images->where('is_primary', true)->first();
                return $primary ? $primary->url : $this->images->first()->url;
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
            return 'Product created successfully.';
        }

        if ($this->wasChanged()) {
            return 'Product updated successfully.';
        }

        return null;
    }
}
