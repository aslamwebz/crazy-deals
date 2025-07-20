<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Product extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'original_price',
        'sku',
        'barcode',
        'stock_quantity',
        'weight',
        'height',
        'width',
        'length',
        'is_featured',
        'is_active',
        'category_id',
        'brand_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'width' => 'decimal:2',
        'length' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_price',
        'formatted_original_price',
        'discount_percentage',
        'in_stock',
        'primary_image',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            
            if (empty($product->sku)) {
                $product->sku = 'PROD-' . strtoupper(Str::random(8));
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that owns the product.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Get the primary image for the product.
     */
    public function primaryImage(): HasMany
    {
        return $this->images()->where('is_primary', true);
    }

    /**
     * Get the reviews for the product.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * The flashDeals that belong to the product.
     */
    public function flashDeals(): BelongsToMany
    {
        return $this->belongsToMany(FlashDeal::class, 'flash_deal_products')
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
     * Get the order items for the product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the formatted price attribute.
     */
    public function getFormattedPriceAttribute(): string
    {
        return '₦' . number_format($this->price, 2);
    }

    /**
     * Get the formatted original price attribute.
     */
    public function getFormattedOriginalPriceAttribute(): ?string
    {
        return $this->original_price ? '₦' . number_format($this->original_price, 2) : null;
    }

    /**
     * Get the discount percentage attribute.
     */
    public function getDiscountPercentageAttribute(): ?int
    {
        if (!$this->original_price || $this->original_price <= 0) {
            return null;
        }

        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    /**
     * Get the in stock attribute.
     */
    public function getInStockAttribute(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Get the primary image URL.
     */
    public function getPrimaryImageAttribute(): ?string
    {
        $primary = $this->primaryImage()->first();
        
        if ($primary) {
            return $primary->image_path;
        }
        
        $firstImage = $this->images()->first();
        
        return $firstImage ? $firstImage->image_path : null;
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include products in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Scope a query to only include products on sale.
     */
    public function scopeOnSale($query)
    {
        return $query->whereColumn('price', '<', 'original_price')
            ->where('original_price', '>', 0);
    }

    /**
     * Check if the product is on sale.
     */
    public function isOnSale(): bool
    {
        return $this->original_price > 0 && $this->price < $this->original_price;
    }

    /**
     * Check if the product is out of stock.
     */
    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }

    /**
     * Check if the product is low in stock.
     */
    public function isLowInStock(int $threshold = 10): bool
    {
        return $this->stock_quantity > 0 && $this->stock_quantity <= $threshold;
    }

    /**
     * Decrement the stock quantity.
     */
    public function decrementStock(int $quantity = 1): bool
    {
        return $this->decrement('stock_quantity', $quantity);
    }

    /**
     * Increment the stock quantity.
     */
    public function incrementStock(int $quantity = 1): bool
    {
        return $this->increment('stock_quantity', $quantity);
    }
}
