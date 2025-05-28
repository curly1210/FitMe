<?php


use App\Http\Controllers\api\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VariationController;

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



Route::prefix('variations')->group(function () {
    // list màu sắc và kích thước
    // Route::get('/', [VariationController::class, 'index']);


    // màu sắc
    Route::middleware('auth:api')->get('/color', [VariationController::class, 'listColor']);

    // Route::get('/color', [VariationController::class, 'listColor']);
    Route::post('/color', [VariationController::class, 'storeColor']);
    Route::get('/color/{id}', [VariationController::class, 'showColor']);
    Route::patch('/color/{id}', [VariationController::class, 'updateColor']);
    Route::delete('/color/{id}', [VariationController::class, 'deleteColor']);
    Route::post('/color/{id}/restore', [VariationController::class, 'restoreColor']);
    Route::delete('/color/{id}/delete', [VariationController::class, 'ForceDeleteColor']);
    Route::get('/color/trashed', [VariationController::class, 'trashedColor']);



    // kích th`ước
    Route::get('/size', [VariationController::class, 'listSize']);
    Route::post('/size', [VariationController::class, 'storeSize']);
    Route::get('/size/{id}', [VariationController::class, 'showSize']);
    Route::patch('/size/{id}', [VariationController::class, 'updateSize']);
    Route::delete('/size/{id}', [VariationController::class, 'deleteSize']);
    Route::post('/size/{id}/restore', [VariationController::class, 'restoreSize']);
    Route::delete('/size/{id}/delete', [VariationController::class, 'ForceDeleteSize']);
    Route::get('/size/trashed', [VariationController::class, 'trashedSize']);
});










































//Router quản lý danh mục
Route::prefix('admin')->name('admin')->group(function () {
    Route::get('/categories', [CategoryController::class, "index"])->name('categories.index');
    Route::post('/categories/insert', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('categories.show');
    Route::patch('/categories/update/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});
