<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Review;
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
        $productItemId = $request->input('product_item_id');
        // dd($productItemId);
        if (!$productItemId) {
            return $this->error("Lỗi đánh giá", ['product_id' => 'Trường product_id là bắt buộc'], 400);
        } else {
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
            return  ReviewResource::collection($reviews);
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
