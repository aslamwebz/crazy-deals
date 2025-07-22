<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class OrderResource extends BaseResource
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
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'subtotal' => (float) $this->subtotal,
            'tax_amount' => (float) $this->tax_amount,
            'shipping_amount' => (float) $this->shipping_amount,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'payment_reference' => $this->when($this->payment_reference, $this->payment_reference),
            'shipping_method' => $this->shipping_method,
            'tracking_number' => $this->when($this->tracking_number, $this->tracking_number),
            'tracking_url' => $this->when($this->tracking_url, $this->tracking_url),
            'shipping_carrier' => $this->when($this->shipping_carrier, $this->shipping_carrier),
            'notes' => $this->when($this->notes, $this->notes),
            'admin_notes' => $this->when($this->admin_notes && $request->user()?->can('viewAdminNotes', $this->resource), $this->admin_notes),
            'cancellation_reason' => $this->when($this->cancellation_reason, $this->cancellation_reason),
            'refund_reason' => $this->when($this->refund_reason, $this->refund_reason),
            'refund_amount' => $this->when($this->refund_amount, (float) $this->refund_amount),
            'shipped_at' => $this->shipped_at,
            'delivered_at' => $this->delivered_at,
            'cancelled_at' => $this->cancelled_at,
            'refunded_at' => $this->refunded_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'items' => $this->whenLoaded('items', function () {
                return OrderItemResource::collection($this->items);
            }),
            'shipping_address' => $this->whenLoaded('shippingAddress', function () {
                return new UserAddressResource($this->shippingAddress);
            }),
            'billing_address' => $this->whenLoaded('billingAddress', function () {
                return new UserAddressResource($this->billingAddress);
            }),
            
            // Computed attributes
            'item_count' => $this->when(isset($this->items_count), $this->items_count),
            'is_cancellable' => $this->isCancellable(),
            'is_returnable' => $this->isReturnable(),
            'is_refundable' => $this->isRefundable(),
            'status_label' => $this->getStatusLabel(),
            'payment_status_label' => $this->getPaymentStatusLabel(),
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
            return 'Order placed successfully.';
        }

        if ($this->wasChanged('status')) {
            return match ($this->status) {
                'cancelled' => 'Order has been cancelled.',
                'shipped' => 'Order has been shipped.',
                'delivered' => 'Order has been delivered.',
                'refunded' => 'Order has been refunded.',
                default => 'Order updated successfully.'
            };
        }

        return null;
    }
}
