<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductItemResource extends BaseResource
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
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price ? (float) $this->compare_at_price : null,
            'quantity' => (int) $this->quantity,
            'weight' => $this->weight ? (float) $this->weight : null,
            'is_default' => (bool) $this->is_default,
            'options' => $this->options,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'in_stock' => (bool) $this->in_stock,
            'is_on_sale' => $this->compare_at_price > $this->price,
            'discount_percentage' => $this->when($this->compare_at_price > $this->price, 
                round((($this->compare_at_price - $this->price) / $this->compare_at_price) * 100)
            ),
        ];
    }
}
