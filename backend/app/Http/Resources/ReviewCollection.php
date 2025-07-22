<?php

namespace App\Http\Resources;

class ReviewCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = ReviewResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Reviews retrieved successfully.';
    }
}
