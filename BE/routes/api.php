<?php

use App\Http\Controllers\api\UserController;
use App\Http\Controllers\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VariationController;

// Route Authen
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});

























































//router quản lý biến thể



Route::prefix('variations')->group(function () {
    // list màu sắc và kích thước
    // Route::get('/', [VariationController::class, 'index']);


    // màu sắc
    Route::get('/color', [VariationController::class, 'listColor']);
    Route::post('/color', [VariationController::class, 'storeColor']);
    Route::get('/color/{id}', [VariationController::class, 'showColor']);
    Route::put('/color/{id}', [VariationController::class, 'updateColor']);
    Route::delete('/color/{id}', [VariationController::class, 'deleteColor']);
    Route::post('/color/{id}/restore', [VariationController::class, 'restoreColor']);
    Route::delete('/color/{id}/delete', [VariationController::class, 'ForceDeleteColor']);
    Route::get('/color/trashed', [VariationController::class, 'trashedColor']);



    // kích th`ước
    Route::get('/size', [VariationController::class, 'listSize']);
    Route::post('/size', [VariationController::class, 'storeSize']);
    Route::get('/size/{id}', [VariationController::class, 'showSize']);
    Route::put('/size/{id}', [VariationController::class, 'updateSize']);
    Route::delete('/size/{id}', [VariationController::class, 'deleteSize']);
    Route::post('/size/{id}/restore', [VariationController::class, 'restoreSize']);
    Route::delete('/size/{id}/delete', [VariationController::class, 'ForceDeleteSize']);
    Route::get('/size/trashed', [VariationController::class, 'trashedSize']);




});









































//Router quản lý danh mục
