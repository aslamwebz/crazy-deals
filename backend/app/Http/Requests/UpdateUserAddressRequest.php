<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserAddressRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        return [
            'type' => 'sometimes|required|string|in:shipping,billing,both',
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'company' => 'nullable|string|max:255',
            'address_line_1' => 'sometimes|required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'country' => 'sometimes|required|string|max:100',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'is_default' => 'sometimes|boolean',
            'additional' => 'nullable|array',
        ];
    }

    public function messages()
    {
        return [
            'type.in' => 'Address type must be shipping, billing, or both.',
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'address_line_1.required' => 'Address line 1 is required.',
            'city.required' => 'City is required.',
            'state.required' => 'State/Region is required.',
            'postal_code.required' => 'Postal/ZIP code is required.',
            'country.required' => 'Country is required.',
            'phone.required' => 'Phone number is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
        ];
    }
}
