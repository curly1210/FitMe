<?php

use App\Http\Controllers\api\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route Authen
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('jwt.auth')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
// });

























































//router quản lý biến thể













































//Router quản lý danh mục
