<?php

namespace App\Http\Resources;

class ProductCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = ProductResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Products retrieved successfully.';
    }
}
