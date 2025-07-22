<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class UserResource extends BaseResource
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
            'name' => $this->name,
            'email' => $this->when($this->shouldIncludeEmail($request), $this->email),
            'phone' => $this->when($this->phone, $this->phone),
            'avatar' => $this->avatar,
            'email_verified_at' => $this->when($this->email_verified_at, $this->email_verified_at),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'addresses' => $this->whenLoaded('addresses', function () {
                return UserAddressResource::collection($this->addresses);
            }),
            'default_address' => $this->whenLoaded('defaultAddress', function () {
                return new UserAddressResource($this->defaultAddress);
            }),
            'roles' => $this->when($this->relationLoaded('roles'), function () {
                return $this->roles->pluck('name');
            }),
            'permissions' => $this->when($this->relationLoaded('permissions'), function () {
                return $this->getAllPermissions()->pluck('name');
            }),
            
            // Computed attributes
            'has_verified_email' => $this->hasVerifiedEmail(),
            'is_admin' => $this->hasRole('admin'),
            'is_customer' => $this->hasRole('customer'),
        ];
    }

    /**
     * Determine if the user's email address should be included in the response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function shouldIncludeEmail($request)
    {
        // Only include email if the user is viewing their own profile or has permission to view user emails
        return $request->user() && 
               ($request->user()->id === $this->id || 
                $request->user()->can('view user emails'));
    }
}
