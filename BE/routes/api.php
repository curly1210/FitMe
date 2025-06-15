<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\CouponController;
use App\Http\Controllers\Api\Client\OrderController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\api\Client\AddressController;
use App\Http\Controllers\Api\Client\ProductController;
use App\Http\Controllers\Api\Admin\VariationController;
use App\Http\Controllers\api\Client\CartItemController;
use App\Http\Controllers\Api\Client\WishlistController;
use App\Http\Controllers\Api\Client\PostController as ClientPostController;
use App\Http\Controllers\api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Client\BannerController as ClientBannerController;
use App\Http\Controllers\Api\Client\CategoryController as ClientCategoryController;
use App\Http\Controllers\Api\Client\CommentController;

// Route Authen
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/logout', [AuthController::class, 'logout']);

// Route::middleware('jwt.auth')->group(function () {
//     Route::middleware('role.admin')->group(function () {
//     });
// });

//router quản lý biến thể
Route::prefix('admin')->group(function () {
    // màu sắc
    // Route::middleware('auth:api')->get('/variations/color', [VariationController::class, 'listColor']);
    Route::get('/variations/color', [VariationController::class, 'listColor']);
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


Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::post('/orders/redem', [OrderController::class, 'redem']);
Route::post('/orders/checkout', [OrderController::class, 'store']);
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders/{id}', [OrderController::class, 'update']);
Route::patch('/orders/{id}', [OrderController::class, 'update']);
























//Router quản lý danh mục
Route::prefix('admin')->name('admin')->group(function () {
    Route::get('/categories', [CategoryController::class, "index"])->name('categories.index');
    Route::post('/categories/insert', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('categories.show');
    Route::patch('/categories/update/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});
//Route quản lý banner

Route::prefix('admin')->name('admin')->group(function () {
    Route::get('/banners', [BannerController::class, "index"])->name('banners.index');
    Route::get('/banners/categories', [BannerController::class, 'getCategories'])->name('banners.getCategories');
    Route::get('/banners/posts', [BannerController::class, 'getPosts'])->name('banners.getPosts');
    Route::get('/banners/products', [BannerController::class, 'getProducts'])->name('banners.getProducts');
    Route::get('/banners/{id}', [BannerController::class, 'show'])->name('banners.show');
    Route::patch('/banners/{id}', [BannerController::class, 'update'])->name('banners.update');
});




//Route quản lý sản phẩm
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    // Route::patch('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::post('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::get('/products/show/{id}', [AdminProductController::class, 'show'])->name('products.show');
    Route::delete('/products/destroy/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/products/trash', [AdminProductController::class, 'trash'])->name('products.trash');
    Route::post('/products/restore/{id}', [AdminProductController::class, 'restore'])->name('products.restore');
    Route::delete('/products/{id}', [AdminProductController::class, 'delete'])->name('products.delete');
});



//Route quản lí phiếu giảm giá
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::patch('/coupons/{id}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{id}', [CouponController::class, 'delete'])->name('coupons.delete');
});


//Route bình luận
Route::get('/comments', [CommentController::class, 'index'])->name('comments.index');
Route::middleware('auth:api')->group(function () {
    Route::post('products/{productId}/comments', [CommentController::class, 'store']);
});










//client
Route::get("/category/{slug}", [ProductController::class, "getProductsByCategory"]);
Route::get("/search", [ProductController::class, "getProductsByKeyWord"]);
Route::get("/get-colors", [ProductController::class, "getColors"]);
Route::get("/get-sizes", [ProductController::class, "getSizes"]);














































































































// CLient
Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
Route::get('/addresses/{id}', [AddressController::class, 'show'])->name('addresses.show');
Route::patch('/addresses/{id}', [AddressController::class, 'update'])->name('addresses.update');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->name('addresses.destroy');

//client
//Banner

Route::prefix('client')->group(function () {
    Route::get('banners', [ClientBannerController::class, 'index']);
    Route::get('posts', [ClientPostController::class, 'index']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::get('/categories', [ClientCategoryController::class, 'index']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{product_id}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
});


Route::prefix('cart-items')->group(function () {
    Route::get('/', [CartItemController::class, 'index'])->name('cart-items.index');
    Route::post('/', [CartItemController::class, 'store'])->name('cart-items.store');
    Route::post('/{id}', [CartItemController::class, 'update'])->name('cart-items.update');
    Route::patch('/{id}', [CartItemController::class, 'update'])->name('cart-items.update');
    Route::delete('/{id}', [CartItemController::class, 'destroy'])->name('cart-items.destroy');
});
