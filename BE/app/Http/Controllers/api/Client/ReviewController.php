<?php

namespace App\Http\Controllers\api\Client;

use App\Models\Order;
use App\Models\Review;
use App\Models\Product;
use App\Models\ReviewImage;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\UploadedFile;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Client\OrderResource;
use App\Http\Resources\Client\ReviewResource;
use App\Http\Resources\Client\OrderReviewResource;

class ReviewController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index(Request $request)
    {
        $rate = $request->query('rate');

        $productId = $request->query('product_id');
        // dd($productItemId);
        $product = Product::query()->with('productItems')->where('id', $productId)->first();
        $perPage = $request->input('per_page', 10);
        if (!$product) {
            return $this->error("Không tìm thấy sản phẩm", ['Sản phẩm không tồn tại'], 404);
        } else {

            $productItemId = $product->productItems->pluck('id')->toArray();
            if ((int) $rate == 1) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 1)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 2) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 2)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 3) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 3)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 4) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 4)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 5) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 5)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            } else {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            }

            $reviewRate = min(round($product->reviews()->avg('rate'), 1), 5);
            $roundedRate = round($reviewRate * 2) / 2;


            $reviews = $query->paginate($perPage);

            return  ReviewResource::collection($reviews)->additional([
                'review_rate' => $roundedRate,
                'total_review' => $product->reviews()->count(),
                'total_review_1' => $product->reviews()->where('rate', 1)->count(),
                'total_review_2' => $product->reviews()->where('rate', 2)->count(),
                'total_review_3' => $product->reviews()->where('rate', 3)->count(),
                'total_review_4' => $product->reviews()->where('rate', 4)->count(),
                'total_review_5' => $product->reviews()->where('rate', 5)->count(),
            ]);
        }
    }
    public function getProductsNeedReview(Request $request)
    {
        try {
            $order = Order::with(['orderDetails.productItem.product'])
                ->where('id', $request->query('order_id'))
                ->where('status_order_id', 6)
                ->where('success_at', '>=', Carbon::now()->subDays(7))
                ->first();
            if (!$order || !$order->orderDetails || $order->orderDetails->isEmpty()) {
                return $this->error("Không tìm thấy đơn hàng hoặc đơn hàng không có sản phẩm", [], 404);
            }
            $data = $order->orderDetails->map(function ($orderDetail) {
                if (!$orderDetail) return null;
                // dd($orderDetail->review);
                return [
                    'id' => $orderDetail->id,
                    "order_id" => $orderDetail->order_id,
                    'product_item_id' => $orderDetail->product_item_id,
                    'product_name' => $orderDetail->name_product,
                    'product_image' => $this->buildImageUrl($orderDetail->image_product),
                    "is_review" => $orderDetail->review ? 1 : 0,
                    "is_updated_review" => $orderDetail->review ? $orderDetail->review->is_update : 0,
                    "price" => $orderDetail->price,
                    "sale_price" => $orderDetail->sale_price,
                    "sale_percent" => $orderDetail->sale_percent,
                    "quantity" => $orderDetail->quantity,
                    "size" => $orderDetail->size,
                    "color" => $orderDetail->color,
                ];
            })->filter(); // Loại bỏ null nếu có
            return response()->json($data);
        } catch (\Throwable $th) {
            return $this->error("Lỗi khi lấy sản phẩm cần đánh giá", $th->getMessage(), 500);
        }
    }
    public function edit(Request $request)
    {
        // dd($request->user());
        try {
            $review = Review::with(['reviewImages'])->find($request->query('review_id'));

            if (!$review) {
                return $this->error("Đánh giá không tồn tại", ['id' => 'Đánh giá không tồn tại'], 404);
            }
            if (!$request->user()) {
                return $this->error("Người dùng chưa đăng nhập", [], 403);
            }

            $data = [
                "id" => $review->id,
                "rate" => $review->rate,
                "content" => $review->content,
                "is_active" => $review->is_active,
                "is_update" => $review->is_update,
                "user" => [
                    "name" => $request->user()->name,
                    "avatar" => $this->buildImageUrl($request->user()->avatar),
                ],
                "product" => [
                    "product_name" => $review->orderDetail->name_product,
                    "size" => $review->orderDetail->size,
                    "color" => $review->orderDetail->color,
                    "image_product" => $this->buildImageUrl($review->orderDetail->image_product),
                    "price" => $review->orderDetail->price,
                    "sale_price" => $review->orderDetail->sale_price,
                    "sale_percent" => $review->orderDetail->sale_percent,
                    "quantity" => $review->orderDetail->quantity,
                ],
                "review_images" => $review->reviewImages ? $review->reviewImages->map(function ($image) {
                    return [

                        "url" => $this->buildImageUrl($image->url),
                    ];
                }) : [],
                "created_at" => $review->created_at ?? null,
                "updated_at" => $review->updated_at ?? null
            ];
            return response()->json($data);
        } catch (\Throwable $th) {
            return $this->error("Lỗi khi lấy đánh giá",  $th->getMessage(), 500);
        }
    }
    public function create(Request $request)
    {

        try {
            $validator = Validator::make(
                $request->only(['product_item_id', 'order_detail_id', 'rate', 'content', 'review_images']),
                [
                    'product_item_id' => 'required|exists:product_items,id',
                    "order_detail_id" => 'required|exists:orders_detail,id',
                    'rate' => 'required|integer|min:1|max:5',
                    'content' => 'nullable|string|max:1000',

                    'review_images.*.url' => 'image|mimes:jpeg,png,jpg,webp|max:2048',

                ],
                [
                    'product_item_id.required' => 'Trường product_item_id là bắt buộc',
                    'product_item_id.exists' => 'Sản phẩm không tồn tại',
                    'order_detail_id.required' => 'Trường order_detail_id là bắt buộc',
                    'order_detail_id.exists' => 'Chi tiết đơn hàng không tồn tại',
                    'rate.required' => 'Trường rate là bắt buộc',
                    'rate.integer' => 'Rate phải là một số nguyên',
                    'rate.min' => 'Rate phải lớn hơn hoặc bằng 1',
                    'rate.max' => 'Rate phải nhỏ hơn hoặc bằng 5',
                    'content.max' => 'Nội dung đánh giá không được vượt quá 1000 ký tự',
                    'review_images.*.url.image' => 'Các tệp đánh giá phải là hình ảnh',
                    'review_images.*.url.mimes' => 'Các tệp đánh giá phải có định dạng jpeg, png, jpg hoặc webp',
                    'review_images.*.url.max' => 'Kích thước tệp đánh giá không được vượt quá 2MB',

                ]
            );
            if ($validator->fails()) {
                return $this->error("Lỗi xác thực",  $validator->errors(), 422);
            } else if (!$request->user()) {
                return $this->error('Bạn chưa đăng nhập', [], 403);
            } else {

                $review = Review::create([
                    'user_id' => $request->user()->id,
                    'product_item_id' => $request->input('product_item_id'),
                    'order_detail_id' => $request->input('order_detail_id'),
                    'rate' => $request->input('rate'),
                    'content' => $request->input('content'),
                ]);

                if ($request->review_images !== []) {
                    $images = $request->review_images;


                    foreach ($images as $image) {
                        $url = $this->uploadImageToCloudinary($image['url'], ['folder' => 'reviews/' . $review->id]);
                        $review->reviewImages()->create(['url' => $url['public_id']]);
                    }
                }
                $data = [
                    "id" => $review->id,
                    "rate" => $review->rate,
                    "content" => $review->content,
                    "is_active" => 1,
                    "review_images" => $review->reviewImages ? $review->reviewImages->map(function ($image) {
                        return [
                            "id" => $image->id,
                            "url" => $this->buildImageUrl($image->url),
                        ];
                    }) : [],
                ];
                return $this->success($data, "Đánh giá đã được tạo thành công", 201);
            }
        } catch (\Throwable $th) {
            return $this->error("Lỗi khi tạo đánh giá",  $th->getMessage(), 500);
        }
    }
    public function update(Request $request)
    {

        // return response()->json($request->review_images);
        try {
            $validator = Validator::make(
                $request->only(['content', 'review_images']),
                [

                    'content' => 'nullable|string|max:1000',
                    // 'review_images' => 'nullable|array',
                    'review_images.*.url' => [
                        'required_with:images|file|mimes:jpeg,png,jpg,webp|max:2048|nullable',
                        fn($att, $val, $fail) =>
                        !is_string($val) && !($val instanceof \Illuminate\Http\UploadedFile)
                            && $fail("$att phải là một file hoặc một chuỗi.")
                    ],
                ],
                [

                    'content.max' => 'Nội dung đánh giá không được vượt quá 1000 ký tự',
                    "review_images.array" => 'Trường review_images phải là một mảng',
                    'review_images.*.url.required_with' => 'Trường review_images là bắt buộc nếu có hình ảnh',
                    'review_images.*.url.file' => 'Các tệp đánh giá phải là hình ảnh',
                    'review_images.*.url.mimes' => 'Các tệp đánh giá phải có định dạng jpeg, png, jpg hoặc webp',
                    'review_images.*.url.max' => 'Kích thước tệp đánh giá không được vượt quá 2MB',

                ]
            );
            if ($validator->fails()) {
                return $this->error("Lỗi xác thực", ['errors' => $validator->errors()], 422);
            } else {
                $review = Review::find($request->query('review_id'));
                if (!$review) {
                    return $this->error("Đánh giá không tồn tại", ['id' => 'Đánh giá không tồn tại'], 404);
                }

                $review->update([
                    'content' => $request->input('content') ?? null,
                    'is_update' => 1,
                ]);



                $inputUrls = [];
                if ($request->review_images && is_array($request->review_images)) {
                    foreach ($request->review_images as $img) {
                        if (is_array($img) && isset($img['url'])) {
                            $inputUrls[] = $img['url'];
                        }
                    }


                    # Lấy ảnh review đã có trong cơ sở dữ liệu
                    $existingImages  = ReviewImage::query()->where('review_id', $review->id)->get();
                    if (empty($inputUrls)) {
                        // Nếu không còn ảnh nào, xóa hết ảnh cũ trong DB và Cloudinary
                        foreach ($existingImages as $dbImage) {
                            $this->deleteImageFromCloudinary($dbImage["url"]);
                            $dbImage->delete();
                        }
                        foreach ($existingImages as $dbImage) {
                            $checkUrl = $this->buildImageUrl($dbImage["url"]);
                            // if (!in_array($checkUrl, $inputUrls)) {
                            $this->deleteImageFromCloudinary($dbImage["url"]);
                            $reviewImageDelete = ReviewImage::find($dbImage->id);
                            $reviewImageDelete->delete();
                            // }
                        }
                    } else {
                        // Nếu còn ảnh, xử lý như cũ
                        foreach ($existingImages as $dbImage) {
                            $checkUrl = $this->buildImageUrl($dbImage["url"]);
                            if (!in_array($checkUrl, $inputUrls)) {
                                $this->deleteImageFromCloudinary($dbImage["url"]);
                                $dbImage->delete();
                            }
                        }
                    }
                    foreach ($request->review_images as $imageData) {

                        if ($imageData['url'] instanceof UploadedFile) {


                            $uploadResult = $this->uploadImageToCloudinary($imageData['url'], [
                                'quality' => 80,
                                'folder' => "reviews/{$review->id}",
                            ]);
                            try {
                                ReviewImage::create([
                                    'review_id' => $review->id,
                                    'url' => $uploadResult['public_id'],
                                ]);
                            } catch (\Throwable $th) {
                                return response()->json($th->getMessage());
                            }
                        }
                    }
                }
            }


            $review->fresh();
            $data = [
                "id" => $review->id,
                "rate" => $review->rate,
                "content" => $review->content,
                "is_active" => $review->is_active,
                "review_images" => $review->reviewImages ? $review->reviewImages->map(function ($image) {
                    return [
                        "id" => $image->id,
                        "url" => $this->buildImageUrl($image->url),
                    ];
                }) : [],
            ];
            return $this->success($data, "Cập nhật đánh giá thành công", 201);
        } catch (\Throwable $th) {
            return $this->error("Lỗi khi cập nhật đánh giá", $th->getMessage(), 500);
        }
    }
}
