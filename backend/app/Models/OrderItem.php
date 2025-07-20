<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_description',
        'product_sku',
        'unit_price',
        'quantity',
        'total_price',
        'discount_amount',
        'tax_amount',
        'options',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'options' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_unit_price',
        'formatted_total_price',
        'formatted_discount_amount',
        'formatted_tax_amount',
    ];

    /**
     * Get the order that owns the order item.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product that owns the order item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the formatted unit price attribute.
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return '₦' . number_format($this->unit_price, 2);
    }

    /**
     * Get the formatted total price attribute.
     */
    public function getFormattedTotalPriceAttribute(): string
    {
        return '₦' . number_format($this->total_price, 2);
    }

    /**
     * Get the formatted discount amount attribute.
     */
    public function getFormattedDiscountAmountAttribute(): string
    {
        return '₦' . number_format($this->discount_amount, 2);
    }

    /**
     * Get the formatted tax amount attribute.
     */
    public function getFormattedTaxAmountAttribute(): string
    {
        return '₦' . number_format($this->tax_amount, 2);
    }

    /**
     * Calculate the total price for the order item.
     */
    public function calculateTotalPrice(): void
    {
        $this->total_price = ($this->unit_price * $this->quantity) - $this->discount_amount + $this->tax_amount;
    }

    /**
     * Get the options attribute with default values.
     */
    public function getOptionsAttribute($value)
    {
        $options = json_decode($value, true) ?: [];
        
        // Ensure we always return an array with at least empty values for expected options
        return array_merge([
            'size' => null,
            'color' => null,
            'weight' => null,
            'dimensions' => null,
        ], $options);
    }

    /**
     * Get the option by key.
     */
    public function getOption(string $key, $default = null)
    {
        return $this->options[$key] ?? $default;
    }

    /**
     * Get the product name with variant details if available.
     */
    public function getDisplayNameAttribute(): string
    {
        $name = $this->product_name;
        $variant = [];

        if ($color = $this->getOption('color')) {
            $variant[] = ucfirst($color);
        }

        if ($size = $this->getOption('size')) {
            $variant[] = strtoupper($size);
        }

        if (!empty($variant)) {
            $name .= ' (' . implode(' / ', $variant) . ')';
        }

        return $name;
    }

    /**
     * Scope a query to only include order items for a specific product.
     */
    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}
