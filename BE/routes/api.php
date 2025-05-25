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
    Route::post  ('/color',              [VariationController::class, 'storeColor']);
    Route::post  ('/color/{id}',         [VariationController::class, 'updateColor']);
    Route::delete('/color/{id}',         [VariationController::class, 'deleteColor']);
    Route::post  ('/color/{id}/restore', [VariationController::class, 'restoreColor']);


    // kích th`ước
    Route::post  ('/size',              [VariationController::class, 'storeSize']);
    Route::post  ('/size/{id}',         [VariationController::class, 'updateSize']);
    Route::delete('/size/{id}',         [VariationController::class, 'deleteSize']);
    Route::post  ('/size/{id}/restore', [VariationController::class, 'restoreSize']);


});









































//Router quản lý danh mục
