<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class OrderItemResource extends BaseResource
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
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'product_item_id' => $this->product_item_id,
            'product_name' => $this->product_name,
            'product_sku' => $this->product_sku,
            'product_barcode' => $this->product_barcode,
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $this->subtotal,
            'tax_amount' => (float) $this->tax_amount,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total,
            'options' => $this->options,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'image' => $this->product->primary_image,
                    'url' => route('products.show', $this->product->slug),
                ];
            }),
            'product_item' => $this->whenLoaded('productItem', function () {
                return [
                    'id' => $this->productItem->id,
                    'sku' => $this->productItem->sku,
                    'price' => (float) $this->productItem->price,
                    'options' => $this->productItem->options,
                ];
            }),
            'review' => $this->whenLoaded('review', function () {
                return new ReviewResource($this->review);
            }),
            
            // Computed attributes
            'can_review' => $this->canReview(),
            'has_review' => $this->review !== null,
            'review_id' => $this->review?->id,
        ];
    }
}
