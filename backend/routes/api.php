<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping\ShoppingController;
use App\Http\Controllers\Admin\AdminUserController;
Use App\Http\Controllers\User\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // 一般ユーザー用
    Route::apiResource('shopping-items', ShoppingController::class);
    Route::post('/shopping-items/{id}/purchase', [ShoppingController::class, 'purchase']);

    // 管理者用
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::apiResource('users', AdminUserController::class)
            ->except(['show']);
    });

    Route::put('/profile', [UserController::class, 'update']);
    Route::put('/profile/password', [UserController::class, 'updatePassword']);
    Route::delete('/profile', [UserController::class, 'destroy']);

    // ログアウト
    Route::post('/logout', function (Request $request) {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out',
        ]);
    });
});

Route::apiResource('users', AdminUserController::class)
    ->except(['show']);