<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserAddressController;
use App\Http\Controllers\API\WishlistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/tree', [CategoryController::class, 'tree']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/trending', [ProductController::class, 'trending']);
Route::get('/products/flash-deals', [ProductController::class, 'flashDeals']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    // Categories (admin only)
    Route::post('/categories', [CategoryController::class, 'store'])->middleware('can:manage_categories');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->middleware('can:manage_categories');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->middleware('can:manage_categories');

    // Products (admin only)
    Route::post('/products', [ProductController::class, 'store'])->middleware('can:manage_products');
    Route::put('/products/{product}', [ProductController::class, 'update'])->middleware('can:manage_products');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('can:manage_products');

    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve'])->middleware('can:manage_reviews');

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Addresses
    Route::get('/user/addresses', [UserAddressController::class, 'index']);
    Route::post('/user/addresses', [UserAddressController::class, 'store']);
    Route::get('/user/addresses/{address}', [UserAddressController::class, 'show']);
    Route::put('/user/addresses/{address}', [UserAddressController::class, 'update']);
    Route::delete('/user/addresses/{address}', [UserAddressController::class, 'destroy']);
    Route::post('/user/addresses/{address}/set-default', [UserAddressController::class, 'setDefault']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{product}', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy']);
    Route::delete('/wishlist', [WishlistController::class, 'clear']);
});