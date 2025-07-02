<?php

use App\Http\Controllers\api\Client\ChatbotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\CouponController;
use App\Http\Controllers\Api\Client\OrderController;
use App\Http\Controllers\api\Client\VNPayController;
use App\Http\Controllers\Api\Admin\CategoryController;

use App\Http\Controllers\api\Client\AddressController;
use App\Http\Controllers\Api\Client\CommentController;
use App\Http\Controllers\Api\Client\ProductController;
use App\Http\Controllers\Api\Admin\VariationController;
use App\Http\Controllers\api\Client\CartItemController;
use App\Http\Controllers\Api\Client\WishlistController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\api\Admin\ReviewReplyController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Client\PostController as ClientPostController;
use App\Http\Controllers\api\Client\UserController as ClientUserController;
use App\Http\Controllers\api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Client\BannerController as ClientBannerController;
use App\Http\Controllers\api\Client\ReviewController as ClientReviewController;
use App\Http\Controllers\Api\Client\CategoryController as ClientCategoryController;

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
    // Route::post('/variations/color/{id}/restore', [VariationController::class, 'restoreColor']);
    // Route::delete('/variations/color/{id}/delete', [VariationController::class, 'ForceDeleteColor']);
    // Route::get('/variations/color/trashed', [VariationController::class, 'trashedColor']);

    // kích th`ước
    Route::get('/variations/size', [VariationController::class, 'listSize']);
    Route::post('/variations/size', [VariationController::class, 'storeSize']);
    Route::get('/variations/size/{id}', [VariationController::class, 'showSize']);
    Route::patch('/variations/size/{id}', [VariationController::class, 'updateSize']);
    Route::delete('/variations/size/{id}', [VariationController::class, 'deleteSize']);
    // Route::post('/variations/size/{id}/restore', [VariationController::class, 'restoreSize']);
    // Route::delete('/variations/size/{id}/delete', [VariationController::class, 'ForceDeleteSize']);
    // Route::get('/variations/size/trashed', [VariationController::class, 'trashedSize']);
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
Route::get('/orders/{id}', [OrderController::class, 'show']);


Route::prefix('admin')->group(function () {
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');

    Route::get('/orders/{id}', [AdminOrderController::class, 'show'])->name('admin.orders.show');

    Route::post('/orders/update/{id}', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
});

Route::get('/admin/statistics/overview', [StatisticsController::class, 'overview']);
Route::get('/admin/statistics', [StatisticsController::class, 'statistics']);
Route::get('/admin/statistics/top-products', [StatisticsController::class, 'topSellingProducts']);
Route::get('/admin/statistics/customers', [StatisticsController::class, 'customerStatistics']);
Route::get('/admin/statistics/products', [StatisticsController::class, 'productStatistics']);
Route::get('/admin/statistics/orderLocation', [StatisticsController::class, 'orderByLocation']);




















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




//Route quản lý sản phẩmD
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    // Route::patch('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::post('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::get('/products/show/{id}', [AdminProductController::class, 'show'])->name('products.show');
    Route::get('/products/trash', [AdminProductController::class, 'trash'])->name('products.trash');
    Route::post('/products/restore/{id}', [AdminProductController::class, 'restore'])->name('products.restore');
    // xóa mềm
    Route::delete('/products/{id}', [AdminProductController::class, 'delete'])->name('products.delete');
    // xóa vĩnh viễn
    Route::delete('/products/destroy/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');
});



//Route quản lí phiếu giảm giá
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::patch('/coupons/{id}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{id}', [CouponController::class, 'delete'])->name('coupons.delete');
});

//Route quản lí tin tức
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('posts/ckeditor-upload', [PostController::class, 'uploadCkeditorImage']);
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/{id}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/{id}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{id}', [PostController::class, 'delete'])->name('posts.delete');
    // Route::post('posts/ckeditor-upload', [PostController::class, 'uploadCkeditorImage']); //Xử lí upload hình ảnh từ content
});


//Route bình luận
Route::get('/comments', [CommentController::class, 'index'])->name('comments.index');
Route::middleware('auth:api')->group(function () {
    Route::post('products/{productId}/comments', [CommentController::class, 'store']);
});
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/products/{id}/comments', [AdminCommentController::class, 'show'])->name('comments.show');
    Route::delete('comments/{id}/delete', [AdminCommentController::class, 'delete'])->name('comments.delete');
    Route::patch('comments/{id}/toggle', [AdminCommentController::class, 'toggleVisibility'])->name('comments.toggleVisibility');
});









//client
Route::get("/category/{slug}", [ProductController::class, "getProductsByCategory"]);
Route::get("/search", [ProductController::class, "getProductsByKeyWord"]);
Route::get("/get-colors", [ProductController::class, "getColors"]);
Route::get("/get-sizes", [ProductController::class, "getSizes"]);




# VNPAY
Route::post('/vnpay/payment', [VNPayController::class, 'handle']);
Route::post('/vnpay/return', [VNPayController::class, 'vnpayReturn']);
Route::post('/vnpay/refund', [VNPayController::class, 'vnpayRefund']);


#review
Route::get('/getProductsNeedReview', [ClientReviewController::class, 'getProductsNeedReview'])->name('reviews.getProductNeedReview');
Route::get('/reviews', [ClientReviewController::class, 'index'])->name('reviews.index'); #api list review trang chi tiết sản phẩm
Route::post('/reviews', [ClientReviewController::class, 'create'])->name('reviews.create'); #api Tạo review
Route::get('/reviews/edit', [ClientReviewController::class, 'edit'])->name('reviews.edit'); #api đổ dữ liệu update review
Route::post('/reviews/update', [ClientReviewController::class, 'update'])->name('reviews.update'); #api update dữ liệu review

Route::prefix('/admin')->group(function () {
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index'); #api list review trang chi tiết sản phẩm
    Route::post('/reviews/hidden', [AdminReviewController::class, 'hidden'])->name('reviews.hidden'); #api list review trang chi tiết sản phẩm
    Route::get("/reviews/reply", [ReviewReplyController::class, "edit"]);
    Route::post("/reviews/reply/create", [ReviewReplyController::class, "create"]);
    Route::post("/reviews/reply/update", [ReviewReplyController::class, "update"]);
    Route::post("/reviews/reply/delete", [ReviewReplyController::class, "delete"]);
});










// info acc client
Route::get('profile', [ClientUserController::class, 'showInfo']);
Route::post('profile', [ClientUserController::class, 'updateInfoBasic']);
Route::patch('profil', [ClientUserController::class, 'updateInfoBasic']);
Route::post('change-password', [ClientUserController::class, 'updatePassword']);
Route::patch('change-password/{id}', [ClientUserController::class, 'updatePassword']);

// chatbot
Route::post('/chatbot', [ChatbotController::class, 'chat']);
Route::post('/chatbot/reset', [ChatbotController::class, 'reset']);


























































































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
    Route::get('posts/{slug}', [ClientPostController::class, 'show'])->name('posts.show');
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::get('/categories', [ClientCategoryController::class, 'index']);
});

Route::middleware('jwt.auth')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{product_id}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::get("/wishlist/getImages", [WishlistController::class, 'getImages'])->name('wishlist.getImages');
});


Route::prefix('cart-items')->group(function () {
    Route::get('/', [CartItemController::class, 'index'])->name('cart-items.index');
    Route::post('/', [CartItemController::class, 'store'])->name('cart-items.store');
    Route::post('/{id}', [CartItemController::class, 'update'])->name('cart-items.update');
    Route::patch('/{id}', [CartItemController::class, 'update'])->name('cart-items.update');
    Route::delete('/{id}', [CartItemController::class, 'destroy'])->name('cart-items.destroy');
});
