<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'title',
        'comment',
        'is_approved',
        'verified_purchase',
        'ip_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'verified_purchase' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_date',
        'rating_stars',
    ];

    /**
     * Get the product that owns the review.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that owns the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the formatted date attribute.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('M d, Y');
    }

    /**
     * Get the rating stars attribute.
     */
    public function getRatingStarsAttribute(): string
    {
        $stars = '';
        $fullStars = floor($this->rating);
        $hasHalfStar = $this->rating - $fullStars >= 0.5;
        
        // Add full stars
        $stars .= str_repeat('★', $fullStars);
        
        // Add half star if needed
        if ($hasHalfStar) {
            $stars .= '½';
            $fullStars++;
        }
        
        // Add empty stars
        $emptyStars = 5 - $fullStars;
        if ($emptyStars > 0) {
            $stars .= str_repeat('☆', $emptyStars);
        }
        
        return $stars;
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope a query to only include reviews with a specific rating or higher.
     */
    public function scopeWithRating($query, $minRating = 1)
    {
        return $query->where('rating', '>=', $minRating);
    }

    /**
     * Scope a query to only include verified purchase reviews.
     */
    public function scopeVerified($query)
    {
        return $query->where('verified_purchase', true);
    }

    /**
     * Scope a query to only include recent reviews.
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Approve the review.
     */
    public function approve(): bool
    {
        return $this->update(['is_approved' => true]);
    }

    /**
     * Disapprove the review.
     */
    public function disapprove(): bool
    {
        return $this->update(['is_approved' => false]);
    }

    /**
     * Check if the review is approved.
     */
    public function isApproved(): bool
    {
        return $this->is_approved === true;
    }

    /**
     * Check if the review is from a verified purchase.
     */
    public function isVerifiedPurchase(): bool
    {
        return $this->verified_purchase === true;
    }

    /**
     * Get the average rating for a product.
     */
    public static function getAverageRating(int $productId): float
    {
        return (float) static::where('product_id', $productId)
            ->approved()
            ->avg('rating');
    }

    /**
     * Get the rating distribution for a product.
     */
    public static function getRatingDistribution(int $productId): array
    {
        $distribution = [
            5 => 0,
            4 => 0,
            3 => 0,
            2 => 0,
            1 => 0,
        ];

        $reviews = static::where('product_id', $productId)
            ->approved()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        foreach ($reviews as $rating => $count) {
            $distribution[$rating] = $count;
        }

        return $distribution;
    }

    /**
     * Get the total number of reviews for a product.
     */
    public static function getTotalReviews(int $productId): int
    {
        return static::where('product_id', $productId)
            ->approved()
            ->count();
    }

    /**
     * Check if a user has already reviewed a product.
     */
    public static function hasUserReviewedProduct(int $userId, int $productId): bool
    {
        return static::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Get the user's review for a product.
     */
    public static function getUserReview(int $userId, int $productId): ?self
    {
        return static::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
    }
}
