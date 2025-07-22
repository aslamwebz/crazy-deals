<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class UserAddressResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'company' => $this->company,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'phone' => $this->phone,
            'email' => $this->email,
            'is_default' => (bool) $this->is_default,
            'additional' => $this->additional,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Computed attributes
            'full_name' => trim($this->first_name . ' ' . $this->last_name),
            'formatted_address' => $this->getFormattedAddress(),
        ];
    }

    /**
     * Get the formatted address as a single string.
     *
     * @return string
     */
    protected function getFormattedAddress()
    {
        $parts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ];

        // Filter out empty parts and join with commas
        return implode(', ', array_filter($parts));
    }
}
