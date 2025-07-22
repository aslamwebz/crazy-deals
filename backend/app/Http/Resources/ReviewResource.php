<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ReviewResource extends BaseResource
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
            'product_id' => $this->product_id,
            'user_id' => $this->user_id,
            'order_item_id' => $this->order_item_id,
            'rating' => (int) $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'is_approved' => (bool) $this->is_approved,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'images' => $this->whenLoaded('images', function () {
                return ReviewImageResource::collection($this->images);
            }),
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'image' => $this->product->primary_image,
                ];
            }),
            'order_item' => $this->whenLoaded('orderItem', function () {
                return [
                    'id' => $this->orderItem->id,
                    'product_name' => $this->orderItem->product_name,
                    'options' => $this->orderItem->options,
                ];
            }),
        ];
    }
}
