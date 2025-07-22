<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'compare_at_price',
        'cost_per_item',
        'barcode',
        'quantity',
        'is_taxable',
        'is_featured',
        'is_trending',
        'is_flash_deal',
        'flash_deal_starts_at',
        'flash_deal_ends_at',
        'requires_shipping',
        'weight',
        'length',
        'width',
        'height',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'cost_per_item' => 'decimal:2',
        'quantity' => 'integer',
        'is_taxable' => 'boolean',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'is_flash_deal' => 'boolean',
        'requires_shipping' => 'boolean',
        'weight' => 'decimal:2',
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'height' => 'decimal:2',
        'flash_deal_starts_at' => 'datetime',
        'flash_deal_ends_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProductItem::class);
    }

    public function defaultItem(): HasOne
    {
        return $this->hasOne(ProductItem::class)->where('is_default', true);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function getRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    public function getReviewCountAttribute(): int
    {
        return $this->reviews()->count();
    }
}
