<?php

namespace App\Http\Controllers\API;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserAddressResource;
use App\Http\Resources\UserAddressCollection;
use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;
use Illuminate\Support\Facades\Auth;

class UserAddressController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $addresses = Auth::user()->addresses()->latest()->get();
        return new UserAddressCollection($addresses);
    }

    public function store(StoreUserAddressRequest $request)
    {
        // If setting as default, unset other defaults
        if ($request->is_default) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }

        $address = Auth::user()->addresses()->create($request->validated());
        return new UserAddressResource($address);
    }

    public function show(UserAddress $address)
    {
        $this->authorize('view', $address);
        return new UserAddressResource($address);
    }

    public function update(UpdateUserAddressRequest $request, UserAddress $address)
    {
        $this->authorize('update', $address);
        
        // If setting as default, unset other defaults
        if ($request->is_default) {
            Auth::user()->addresses()
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($request->validated());
        return new UserAddressResource($address);
    }

    public function destroy(UserAddress $address)
    {
        $this->authorize('delete', $address);
        
        // Prevent deletion if address is used in orders
        if ($address->shippingOrders()->exists() || $address->billingOrders()->exists()) {
            return response()->json([
                'message' => 'Cannot delete address that is associated with orders'
            ], 422);
        }
        
        $address->delete();
        return response()->noContent();
    }

    public function setDefault(UserAddress $address)
    {
        $this->authorize('update', $address);
        
        // Unset other defaults
        Auth::user()->addresses()
            ->where('id', '!=', $address->id)
            ->update(['is_default' => false]);
            
        $address->update(['is_default' => true]);
        
        return new UserAddressResource($address);
    }
}
