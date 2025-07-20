<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Brand extends Model
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
        'logo',
        'website',
        'is_featured',
        'is_active',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'logo_url',
        'product_count',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($brand) {
            if (empty($brand->slug)) {
                $brand->slug = Str::slug($brand->name);
            }
        });

        static::updating(function ($brand) {
            if ($brand->isDirty('name') && empty($brand->slug)) {
                $brand->slug = Str::slug($brand->name);
            }
        });
    }

    /**
     * Get the products for the brand.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the logo URL attribute.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (empty($this->logo)) {
            return null;
        }

        if (filter_var($this->logo, FILTER_VALIDATE_URL)) {
            return $this->logo;
        }

        return asset('storage/' . $this->logo);
    }

    /**
     * Get the product count attribute.
     */
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Scope a query to only include active brands.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured brands.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to sort brands by sort order.
     */
    public function scopeSorted($query, $direction = 'asc')
    {
        return $query->orderBy('sort_order', $direction);
    }

    /**
     * Scope a query to search brands by name.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    /**
     * Activate the brand.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the brand.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Feature the brand.
     */
    public function feature(): bool
    {
        return $this->update(['is_featured' => true]);
    }

    /**
     * Unfeature the brand.
     */
    public function unfeature(): bool
    {
        return $this->update(['is_featured' => false]);
    }

    /**
     * Check if the brand is active.
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    /**
     * Check if the brand is featured.
     */
    public function isFeatured(): bool
    {
        return $this->is_featured === true;
    }

    /**
     * Get the URL for the brand's detail page.
     */
    public function getUrlAttribute(): string
    {
        return route('brands.show', $this->slug);
    }

    /**
     * Get the meta title for the brand.
     */
    public function getMetaTitle(): string
    {
        return $this->meta_title ?? "{$this->name} - Shop Now at CrazyDeals";
    }

    /**
     * Get the meta description for the brand.
     */
    public function getMetaDescription(): string
    {
        return $this->meta_description ?? "Shop the best {$this->name} products at CrazyDeals. Find great deals on {$this->name} items with fast shipping and excellent customer service.";
    }

    /**
     * Get the meta keywords for the brand.
     */
    public function getMetaKeywords(): string
    {
        return $this->meta_keywords ?? "{$this->name}, {$this->name} products, buy {$this->name} online, {$this->name} deals";
    }
}
