<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
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
        'image',
        'parent_id',
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
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'url',
        'children_count',
        'products_count',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Get all descendant categories.
     */
    public function descendants()
    {
        return $this->children()->with('descendants');
    }

    /**
     * Get all ancestor categories.
     */
    public function ancestors()
    {
        return $this->parent ? $this->parent->with('ancestors') : null;
    }

    /**
     * Get the products for the category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the URL attribute.
     */
    public function getUrlAttribute(): string
    {
        return route('categories.show', $this->slug);
    }

    /**
     * Get the children count attribute.
     */
    public function getChildrenCountAttribute(): int
    {
        return $this->children()->count();
    }

    /**
     * Get the products count attribute.
     */
    public function getProductsCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Check if the category has children.
     */
    public function hasChildren(): bool
    {
        return $this->children_count > 0;
    }

    /**
     * Check if the category has a parent.
     */
    public function hasParent(): bool
    {
        return !is_null($this->parent_id);
    }

    /**
     * Check if the category is a child of the given category.
     */
    public function isChildOf(Category $category): bool
    {
        return $this->parent_id === $category->id;
    }

    /**
     * Check if the category is a descendant of the given category.
     */
    public function isDescendantOf(Category $category): bool
    {
        $parent = $this->parent;
        
        while ($parent) {
            if ($parent->id === $category->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        
        return false;
    }

    /**
     * Get all products in this category and its descendants.
     */
    public function allProducts()
    {
        $categoryIds = $this->descendants()->pluck('id')->push($this->id);
        
        return Product::whereIn('category_id', $categoryIds);
    }

    /**
     * Scope a query to only include root categories.
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured categories.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the full path of the category.
     */
    public function getPath(): string
    {
        $path = [];
        $category = $this;
        
        while ($category) {
            array_unshift($path, $category->name);
            $category = $category->parent;
        }
        
        return implode(' > ', $path);
    }

    /**
     * Get the breadcrumbs for the category.
     */
    public function getBreadcrumbs(): array
    {
        $breadcrumbs = [];
        $category = $this;
        
        while ($category) {
            $breadcrumbs[] = [
                'name' => $category->name,
                'url' => $category->url,
            ];
            $category = $category->parent;
        }
        
        return array_reverse($breadcrumbs);
    }
}
