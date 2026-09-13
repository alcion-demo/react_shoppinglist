<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping\ShoppingController;
use App\Http\Controllers\Admin\AdminUserController;
Use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Shopping\RecipeController;
use Illuminate\Support\Facades\Auth;

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
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out',
        ]);
    })->middleware('web');

    //AI献立
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::get('/recipes/{jobId}', [RecipeController::class, 'show']);

});

Route::apiResource('users', AdminUserController::class)
    ->except(['show']);

//献立共有
Route::get('/recipes/share/{data}', [RecipeController::class, 'shared'])
    ->name('shopping.share');