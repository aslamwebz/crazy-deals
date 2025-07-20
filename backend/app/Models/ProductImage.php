<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'image_path',
        'is_primary',
        'alt_text',
        'title',
        'caption',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'image_url',
        'thumbnail_url',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($productImage) {
            if ($productImage->is_primary) {
                $productImage->product->images()->update(['is_primary' => false]);
            }
        });

        static::updating(function ($productImage) {
            if ($productImage->isDirty('is_primary') && $productImage->is_primary) {
                $productImage->product->images()
                    ->where('id', '!=', $productImage->id)
                    ->update(['is_primary' => false]);
            }
        });

        static::deleted(function ($productImage) {
            // Delete the actual image file if it exists
            if (Storage::disk('public')->exists($productImage->image_path)) {
                Storage::disk('public')->delete($productImage->image_path);
            }

            // If the deleted image was primary, set another one as primary
            if ($productImage->is_primary && $productImage->product) {
                $newPrimary = $productImage->product->images()->first();
                if ($newPrimary) {
                    $newPrimary->update(['is_primary' => true]);
                }
            }
        });
    }

    /**
     * Get the product that owns the image.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the image URL attribute.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    /**
     * Get the thumbnail URL attribute.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        $pathInfo = pathinfo($this->image_path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumbs/' . $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];

        return Storage::disk('public')->exists($thumbnailPath)
            ? Storage::disk('public')->url($thumbnailPath)
            : $this->image_url;
    }

    /**
     * Set the image as primary.
     */
    public function setAsPrimary(): bool
    {
        return $this->update(['is_primary' => true]);
    }

    /**
     * Scope a query to only include primary images.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope a query to order images by sort order.
     */
    public function scopeOrdered($query, $direction = 'asc')
    {
        return $query->orderBy('sort_order', $direction);
    }

    /**
     * Get the image dimensions.
     */
    public function getDimensions(): ?array
    {
        if (empty($this->image_path) || filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return null;
        }

        $fullPath = Storage::disk('public')->path($this->image_path);
        
        if (!file_exists($fullPath)) {
            return null;
        }

        list($width, $height) = getimagesize($fullPath);
        
        return [
            'width' => $width,
            'height' => $height,
            'aspect_ratio' => $width / $height,
        ];
    }

    /**
     * Get the image file size.
     */
    public function getFileSize($format = 'KB', $precision = 2): ?float
    {
        if (empty($this->image_path) || filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return null;
        }

        $fullPath = Storage::disk('public')->path($this->image_path);
        
        if (!file_exists($fullPath)) {
            return null;
        }

        $bytes = filesize($fullPath);
        
        switch (strtoupper($format)) {
            case 'KB':
                return round($bytes / 1024, $precision);
            case 'MB':
                return round($bytes / 1048576, $precision);
            case 'GB':
                return round($bytes / 1073741824, $precision);
            default:
                return $bytes;
        }
    }

    /**
     * Get the image file extension.
     */
    public function getFileExtension(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        return pathinfo($this->image_path, PATHINFO_EXTENSION);
    }

    /**
     * Get the image file name.
     */
    public function getFileName(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        return pathinfo($this->image_path, PATHINFO_BASENAME);
    }

    /**
     * Get the image directory path.
     */
    public function getDirectoryPath(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        return pathinfo($this->image_path, PATHINFO_DIRNAME);
    }
}
