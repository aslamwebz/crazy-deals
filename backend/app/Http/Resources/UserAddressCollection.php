<?php

namespace App\Http\Resources;

class UserAddressCollection extends BaseCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = UserAddressResource::class;

    /**
     * Get the message for the response.
     *
     * @return string|null
     */
    protected function getMessage()
    {
        return 'Addresses retrieved successfully.';
    }
}
