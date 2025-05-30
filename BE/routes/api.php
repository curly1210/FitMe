<?php


use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\api\Client\AddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\VariationController;

// Route Authen
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('jwt.auth')->group(function () {
    Route::middleware('role.admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });
});

//router quản lý biến thể
Route::prefix('admin')->group(function () {
    // màu sắc
    Route::middleware('auth:api')->get('/variations/color', [VariationController::class, 'listColor']);
    // Route::get('/variations/color', [VariationController::class, 'listColor']);
    Route::post('/variations/color', [VariationController::class, 'storeColor']);
    Route::get('/variations/color/{id}', [VariationController::class, 'showColor']);
    Route::patch('/variations/color/{id}', [VariationController::class, 'updateColor']);
    Route::delete('/variations/color/{id}', [VariationController::class, 'deleteColor']);
    Route::post('/variations/color/{id}/restore', [VariationController::class, 'restoreColor']);
    Route::delete('/variations/color/{id}/delete', [VariationController::class, 'ForceDeleteColor']);
    Route::get('/variations/color/trashed', [VariationController::class, 'trashedColor']);

    // kích th`ước
    Route::get('/variations/size', [VariationController::class, 'listSize']);
    Route::post('/variations/size', [VariationController::class, 'storeSize']);
    Route::get('/variations/size/{id}', [VariationController::class, 'showSize']);
    Route::patch('/variations/size/{id}', [VariationController::class, 'updateSize']);
    Route::delete('/variations/size/{id}', [VariationController::class, 'deleteSize']);
    Route::post('/variations/size/{id}/restore', [VariationController::class, 'restoreSize']);
    Route::delete('/variations/size/{id}/delete', [VariationController::class, 'ForceDeleteSize']);
    Route::get('/variations/size/trashed', [VariationController::class, 'trashedSize']);
});

Route::prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::patch('/users/lock/{id}', [UserController::class, 'lock']);
});




























//Router quản lý danh mục
Route::prefix('admin')->name('admin')->group(function () {
    Route::get('/categories', [CategoryController::class, "index"])->name('categories.index');
    Route::post('/categories/insert', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('categories.show');
    Route::patch('/categories/update/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});






























// màu sắc
// Route::middleware('auth:api')->get('/color', [VariationController::class, 'listColor']);

Route::get('/color', [VariationController::class, 'listColor']);
Route::post('/color', [VariationController::class, 'storeColor']);
Route::get('/color/{id}', [VariationController::class, 'showColor']);
Route::patch('/color/{id}', [VariationController::class, 'updateColor']);
Route::delete('/color/{id}', [VariationController::class, 'deleteColor']);
Route::post('/color/{id}/restore', [VariationController::class, 'restoreColor']);
Route::delete('/color/{id}/delete', [VariationController::class, 'ForceDeleteColor']);
Route::get('/color/trashed', [VariationController::class, 'trashedColor']);




































































































// CLient
Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
Route::get('/addresses/{id}', [AddressController::class, 'show'])->name('addresses.show');
Route::patch('/addresses/{id}', [AddressController::class, 'update'])->name('addresses.update');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->name('addresses.destroy');
