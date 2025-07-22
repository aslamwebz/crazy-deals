<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Will be handled by policies
    }

    public function rules()
    {
        $order = $this->route('order');
        
        return [
            'status' => [
                'sometimes',
                'required',
                'string',
                'in:pending,processing,shipped,delivered,cancelled,refunded',
                function ($attribute, $value, $fail) use ($order) {
                    $validTransitions = [
                        'pending' => ['processing', 'cancelled'],
                        'processing' => ['shipped', 'cancelled'],
                        'shipped' => ['delivered', 'refunded'],
                        'delivered' => ['refunded'],
                    ];

                    if (isset($validTransitions[$order->status]) && 
                        !in_array($value, $validTransitions[$order->status])) {
                        $fail("Cannot change status from {$order->status} to {$value}");
                    }
                },
            ],
            'tracking_number' => 'nullable|string|max:100',
            'tracking_url' => 'nullable|url|max:255',
            'shipping_carrier' => 'nullable|string|max:100',
            'shipped_at' => 'nullable|date',
            'delivered_at' => 'nullable|date|after_or_equal:shipped_at',
            'cancelled_at' => 'nullable|date',
            'cancellation_reason' => 'required_if:status,cancelled|string|max:255',
            'refunded_at' => 'nullable|date',
            'refund_amount' => 'nullable|numeric|min:0|max:' . $order->total,
            'refund_reason' => 'required_if:status,refunded|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'status.in' => 'Invalid order status.',
            'delivered_at.after_or_equal' => 'Delivery date must be after or equal to shipping date.',
            'refund_amount.max' => 'Refund amount cannot be greater than order total.',
            'cancellation_reason.required_if' => 'Please provide a reason for cancellation.',
            'refund_reason.required_if' => 'Please provide a reason for the refund.',
        ];
    }
}
