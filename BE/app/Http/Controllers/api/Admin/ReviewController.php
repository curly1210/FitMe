<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Review;
use App\Models\Product;
use App\Models\ReviewReply;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\Admin\ReviewResource as AdminReviewResource;
use App\Http\Resources\Client\ReviewResource as ClientReviewResource;


class ReviewController extends Controller
{
    use ApiResponse;
    public function getDetail(Request $request)
    {
        $rate = $request->query('rate');

        $productId = $request->query('product_id');
        // dd($productId)
        $product = Product::query()->with('productItems')->where('id', $productId)->first();
        // dd($product);
        $perPage = $request->input('per_page', 10);
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
                $query = Review::with(['productItem', 'reviewImages', 'user'])->whereIn('product_item_id', $productItemId)->where('is_active', 1)
                    ->orderBy("created_at", "desc");
            }
            $roundedRate = min(round($product->reviews()->avg('rate'), 1), 5);

            $reviews = $query->paginate($perPage);

            return  ClientReviewResource::collection($reviews)->additional([
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
    public function index(Request $request)
    {
        $query =  Product::with('productItems', 'productImages')->withCount('reviews')
            ->withAvg('reviews', 'rate')->withMax('reviews', 'created_at')
            ->orderByDesc('reviews_max_created_at');;
        $perPage = $request->input('per_page', 10);
        if ($request->search) {
            $query->where("name", 'like', '%' . $request->search . '%');
        }
        if ($request->category) {
            $query->where("category_id", $request->category);
        }
        if ($request->rate) {
            #low rate<3
            #high rate>=3
            #null getAll
            if ($request->rate == 'low') {
                $query->having('reviews_avg_rate', '<', 3);
            } else if ($request->rate == 'high') {
                $query->having('reviews_avg_rate', '>=', 3);
            } else if ($request->rate == null) {
                $query->havingNotNull('reviews_avg_rate');
            }
        } else {
            $query->havingNotNull('reviews_avg_rate');
        }
        $data = $query->paginate($perPage);
        // return response()->json($data);
        return AdminReviewResource::collection($data);
    }

    public function hidden(Request $request)
    {
        try {
            $review = Review::find($request->review_id);
            if (!$review) {
                return $this->error("Không tìm thấy đánh giá", ['review_id' => "Đánh giá không tồn tại"], 404);
            }
            $review->is_active = $request->is_active;
            $review->save();
            return $this->success("Đánh giá đã được ẩn thành công");
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(), 500);
        }
    }
}
