<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class FlashDeal extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'banner_image',
        'start_date',
        'end_date',
        'is_active',
        'is_featured',
        'discount_type',
        'discount_value',
        'max_discount',
        'min_purchase',
        'max_purchase',
        'total_products',
        'total_items_sold',
        'total_revenue',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'discount_value' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'max_purchase' => 'decimal:2',
        'total_products' => 'integer',
        'total_items_sold' => 'integer',
        'total_revenue' => 'decimal:2',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'status',
        'time_left',
        'progress',
        'is_ongoing',
        'is_upcoming',
        'is_expired',
    ];

    /**
     * The products that belong to the flash deal.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'flash_deal_products')
            ->withPivot([
                'discount_percentage',
                'discount_amount',
                'final_price',
                'quantity',
                'sold_quantity',
            ])
            ->withTimestamps();
    }

    /**
     * Get the status attribute.
     */
    public function getStatusAttribute(): string
    {
        $now = now();
        
        if ($this->start_date->isFuture()) {
            return 'upcoming';
        }
        
        if ($this->end_date->isPast()) {
            return 'expired';
        }
        
        return 'ongoing';
    }

    /**
     * Get the time left attribute.
     */
    public function getTimeLeftAttribute(): ?array
    {
        if ($this->status === 'expired') {
            return null;
        }
        
        $end = $this->end_date;
        $now = now();
        
        if ($this->status === 'upcoming') {
            $end = $this->start_date;
        }
        
        $diff = $now->diff($end);
        
        return [
            'days' => $diff->d,
            'hours' => $diff->h,
            'minutes' => $diff->i,
            'seconds' => $diff->s,
        ];
    }

    /**
     * Get the progress attribute.
     */
    public function getProgressAttribute(): ?float
    {
        if ($this->status !== 'ongoing') {
            return null;
        }
        
        $total = $this->start_date->diffInSeconds($this->end_date);
        $elapsed = now()->diffInSeconds($this->start_date);
        
        return min(100, max(0, ($elapsed / $total) * 100));
    }

    /**
     * Get the is ongoing attribute.
     */
    public function getIsOngoingAttribute(): bool
    {
        return $this->status === 'ongoing';
    }

    /**
     * Get the is upcoming attribute.
     */
    public function getIsUpcomingAttribute(): bool
    {
        return $this->status === 'upcoming';
    }

    /**
     * Get the is expired attribute.
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->status === 'expired';
    }

    /**
     * Scope a query to only include active flash deals.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured flash deals.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include ongoing flash deals.
     */
    public function scopeOngoing($query)
    {
        $now = now();
        
        return $query->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now);
    }

    /**
     * Scope a query to only include upcoming flash deals.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    /**
     * Scope a query to only include expired flash deals.
     */
    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now());
    }

    /**
     * Check if the flash deal is active.
     */
    public function isActive(): bool
    {
        return $this->is_active && $this->is_ongoing;
    }

    /**
     * Activate the flash deal.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the flash deal.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Add a product to the flash deal.
     */
    public function addProduct(
        Product $product,
        float $discountPercentage,
        int $quantity,
        ?float $finalPrice = null
    ): void {
        $discountAmount = $product->price * ($discountPercentage / 100);
        $finalPrice = $finalPrice ?? ($product->price - $discountAmount);
        
        $this->products()->attach($product->id, [
            'discount_percentage' => $discountPercentage,
            'discount_amount' => $discountAmount,
            'final_price' => $finalPrice,
            'quantity' => $quantity,
            'sold_quantity' => 0,
        ]);
        
        $this->increment('total_products');
    }

    /**
     * Remove a product from the flash deal.
     */
    public function removeProduct(Product $product): void
    {
        $this->products()->detach($product->id);
        $this->decrement('total_products');
    }

    /**
     * Update the sold quantity for a product.
     */
    public function updateSoldQuantity(Product $product, int $quantity): void
    {
        $pivot = $this->products()->where('product_id', $product->id)->first()->pivot;
        
        $this->products()->updateExistingPivot($product->id, [
            'sold_quantity' => $pivot->sold_quantity + $quantity,
        ]);
        
        $this->increment('total_items_sold', $quantity);
        $this->increment('total_revenue', $pivot->final_price * $quantity);
    }

    /**
     * Get the remaining quantity for a product.
     */
    public function getRemainingQuantity(Product $product): int
    {
        $pivot = $this->products()->where('product_id', $product->id)->first()->pivot;
        return $pivot->quantity - $pivot->sold_quantity;
    }

    /**
     * Check if a product is available in the flash deal.
     */
    public function isProductAvailable(Product $product, int $quantity = 1): bool
    {
        $pivot = $this->products()->where('product_id', $product->id)->first()->pivot;
        return $pivot->quantity >= ($pivot->sold_quantity + $quantity);
    }

    /**
     * Get the discount amount for a product.
     */
    public function getDiscountAmount(Product $product): float
    {
        $pivot = $this->products()->where('product_id', $product->id)->first()->pivot;
        return $pivot->discount_amount;
    }

    /**
     * Get the final price for a product.
     */
    public function getFinalPrice(Product $product): float
    {
        $pivot = $this->products()->where('product_id', $product->id)->first()->pivot;
        return $pivot->final_price;
    }
}
