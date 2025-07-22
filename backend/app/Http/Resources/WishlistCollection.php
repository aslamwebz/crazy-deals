<?php

namespace App\Http\Resources;

class WishlistCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = WishlistResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Wishlist items retrieved successfully.';
    }
}
