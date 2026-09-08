<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping\ShoppingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('shopping-items', ShoppingController::class);
    Route::post('/shopping-items/{id}/purchase', [ShoppingController::class, 'purchase']);
});
