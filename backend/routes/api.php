<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductsController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductsController::class);
});