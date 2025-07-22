<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_item_id' => 'nullable|exists:product_items,id,product_id,*',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.options' => 'nullable|array',
            
            'shipping_address' => 'required|array',
            'shipping_address.id' => 'nullable|exists:user_addresses,id,user_id,' . auth()->id(),
            'shipping_address.first_name' => 'required_without:shipping_address.id|string|max:100',
            'shipping_address.last_name' => 'required_without:shipping_address.id|string|max:100',
            'shipping_address.email' => 'required_without:shipping_address.id|email|max:255',
            'shipping_address.phone' => 'required_without:shipping_address.id|string|max:20',
            'shipping_address.address_line_1' => 'required_without:shipping_address.id|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required_without:shipping_address.id|string|max:100',
            'shipping_address.state' => 'required_without:shipping_address.id|string|max:100',
            'shipping_address.postal_code' => 'required_without:shipping_address.id|string|max:20',
            'shipping_address.country' => 'required_without:shipping_address.id|string|max:100',
            'shipping_address.is_default' => 'boolean',
            
            'billing_address' => 'nullable|array',
            'billing_address.id' => 'nullable|exists:user_addresses,id,user_id,' . auth()->id(),
            'billing_address.first_name' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:100',
            'billing_address.last_name' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:100',
            'billing_address.email' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|email|max:255',
            'billing_address.phone' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:20',
            'billing_address.address_line_1' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:255',
            'billing_address.address_line_2' => 'nullable|string|max:255',
            'billing_address.city' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:100',
            'billing_address.state' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:100',
            'billing_address.postal_code' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:20',
            'billing_address.country' => 'required_without_all:billing_address.id,billing_address,same_as_shipping|string|max:100',
            'billing_address.is_default' => 'boolean',
            'same_as_shipping' => 'boolean',
            
            'shipping_method' => 'required|string|max:100',
            'shipping_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:credit_card,paypal,stripe,cod',
            'discount_code' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'accept_terms' => 'required|accepted',
        ];
    }

    public function messages()
    {
        return [
            'items.required' => 'Your cart is empty.',
            'items.*.product_id.exists' => 'One or more products in your cart are no longer available.',
            'items.*.product_item_id.exists' => 'One or more product variants in your cart are no longer available.',
            'shipping_address.required' => 'Shipping address is required.',
            'shipping_method.required' => 'Please select a shipping method.',
            'payment_method.required' => 'Please select a payment method.',
            'accept_terms.required' => 'You must accept the terms and conditions to place an order.',
            'accept_terms.accepted' => 'You must accept the terms and conditions to place an order.',
        ];
    }

    protected function prepareForValidation()
    {
        // If billing address is same as shipping, copy the shipping address
        if ($this->has('same_as_shipping') && $this->same_as_shipping) {
            $shippingAddress = $this->shipping_address;
            $shippingAddress['is_default'] = $shippingAddress['is_default'] ?? false;
            $this->merge([
                'billing_address' => $shippingAddress
            ]);
        }
    }
}
