<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'gender',
        'avatar',
        'status',
        'last_login_at',
        'last_login_ip',
        'default_billing_address_id',
        'default_shipping_address_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all addresses for the user.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get the user's default billing address.
     */
    public function defaultBillingAddress()
    {
        return $this->belongsTo(Address::class, 'default_billing_address_id');
    }

    /**
     * Get the user's default shipping address.
     */
    public function defaultShippingAddress()
    {
        return $this->belongsTo(Address::class, 'default_shipping_address_id');
    }

    /**
     * Get all of the user's orders.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the user's billing addresses.
     */
    public function billingAddresses()
    {
        return $this->addresses()->where('type', 'billing');
    }

    /**
     * Get the user's shipping addresses.
     */
    public function shippingAddresses()
    {
        return $this->addresses()->where('type', 'shipping');
    }

    /**
     * Check if the user has a default billing address.
     */
    public function hasDefaultBillingAddress(): bool
    {
        return $this->default_billing_address_id !== null;
    }

    /**
     * Check if the user has a default shipping address.
     */
    public function hasDefaultShippingAddress(): bool
    {
        return $this->default_shipping_address_id !== null;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->name;
    }
}
