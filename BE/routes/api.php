<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\Api\VariationController;

Route::get('/users', [UserController::class, 'index']);
// Route Authen


























































//router quản lý biến thể



Route::prefix('variations')->group(function () {
    // list màu sắc và kích thước
    Route::get('/', [VariationController::class, 'index']);
    Route::get('/trashed', [VariationController::class, 'trashed']);


    // màu sắc
    Route::post('/colors', [VariationController::class, 'storeColor']);
    Route::post('/colors/{id}', [VariationController::class, 'updateColor']);
    Route::delete('/colors/{id}', [VariationController::class, 'deleteColor']);
    Route::post('/colors/{id}/restore', [VariationController::class, 'restoreColor']);
    Route::delete('/colors/{id}/delete', [VariationController::class, 'ForceDeleteColor']);


    // kích th`ước
    Route::post('/sizes', [VariationController::class, 'storeSize']);
    Route::post('/sizes/{id}', [VariationController::class, 'updateSize']);
    Route::delete('/sizes/{id}', [VariationController::class, 'deleteSize']);
    Route::post('/sizes/{id}/restore', [VariationController::class, 'restoreSize']);
    Route::delete('/sizes/{id}/delete', [VariationController::class, 'ForceDeleteSize']);


});









































//Router quản lý danh mục
