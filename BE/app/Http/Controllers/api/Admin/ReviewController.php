<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Review;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ReviewResource;

class ReviewController extends Controller
{
    use ApiResponse;
    public function index(Request $request)
    {
        $rate = $request->query('rate');
        $productId = $request->query('product_id');
        // dd($productItemId);
        $product = Product::query()->with('productItems')->where('id', $productId)->first();
        if (!$product) {
            return $this->error("Không tìm thấy sản phẩm", ['Sản phẩm không tồn tại'], 404);
        } else {

            $productItemId = $product->productItems->pluck('id')->toArray();
            if ((int) $rate == 1) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 1)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 2) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 2)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 3) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 3)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 4) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 4)
                    ->orderBy("created_at", "desc");
            } else if ((int) $rate == 5) {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->where('rate', 5)
                    ->orderBy("created_at", "desc");
            } else {
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)
                    ->orderBy("created_at", "desc");
            }
            $reviews = $query->paginate(10);

            return  ReviewResource::collection($reviews)->additional([
                'review_rate' =>  min(round($product->reviews()->withoutGlobalScopes()->avg('rate'), 0), 5),
                'total_review' => $product->reviews()->count(),
                'total_review_1' => $product->reviews()->where('rate', 1)->count(),
                'total_review_2' => $product->reviews()->where('rate', 2)->count(),
                'total_review_3' => $product->reviews()->where('rate', 3)->count(),
                'total_review_4' => $product->reviews()->where('rate', 4)->count(),
                'total_review_5' => $product->reviews()->where('rate', 5)->count(),
            ]);
        }
    }
    public function hidden(Request $request)
    {
        $reviewId = $request->input("review_id");
        if (!$reviewId) {
            return $this->error("Lỗi chưa có review_id", ['review_id' => "không có trường review_id"], 400);
        } else {
            $review = Review::find($reviewId);
            if (!$review) {
                return $this->error("Không tìm thấy đánh giá", ['review_id' => "Đánh giá không tồn tại"], 404);
            }
            $review->is_active = 0;
            $review->save();
            return $this->success("Đánh giá đã được ẩn thành công", new ReviewResource($review));
        }
    }
}
