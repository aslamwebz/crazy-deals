<?php

namespace App\Http\Resources;

class CategoryCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = CategoryResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Categories retrieved successfully.';
    }
}
