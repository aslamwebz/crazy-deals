<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        $productId = $this->route('product');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:products,slug,' . $productId,
            'description' => 'sometimes|required|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'sometimes|required|exists:categories,id',
            'price' => 'sometimes|required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'cost_per_item' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string|max:100',
            'quantity' => 'integer|min:0',
            'is_taxable' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_flash_deal' => 'boolean',
            'flash_deal_starts_at' => 'required_if:is_flash_deal,1|nullable|date',
            'flash_deal_ends_at' => 'required_if:is_flash_deal,1|nullable|date|after:flash_deal_starts_at',
            'requires_shipping' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:draft,active,archived',
            'images' => 'sometimes|array|min:1',
            'images.*.url' => 'required_with:images|url',
            'images.*.is_primary' => 'boolean',
            'images.*.order' => 'integer|min:0',
            'variants' => 'sometimes|array',
            'variants.*.name' => 'required_with:variants|string|max:100',
            'variants.*.values' => 'required_with:variants|array|min:1',
            'variants.*.values.*' => 'string|max:100',
            'items' => 'sometimes|array|min:1',
            'items.*.id' => 'sometimes|exists:product_items,id',
            'items.*.sku' => 'required_with:items|string|max:100|unique:product_items,sku,' . $productId . ',product_id',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.compare_at_price' => 'nullable|numeric|min:0|gt:items.*.price',
            'items.*.quantity' => 'integer|min:0',
            'items.*.barcode' => 'nullable|string|max:100',
            'items.*.weight' => 'nullable|numeric|min:0',
            'items.*.options' => 'nullable|array',
            'items.*.is_default' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'flash_deal_ends_at.after' => 'The flash deal end date must be after the start date.',
            'items.*.compare_at_price.gt' => 'The compare at price must be greater than the price.',
            'images.required' => 'At least one product image is required.',
        ];
    }
}
