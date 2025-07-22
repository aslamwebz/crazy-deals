<?php

namespace App\Http\Resources;

class OrderCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = OrderResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Orders retrieved successfully.';
    }
}
