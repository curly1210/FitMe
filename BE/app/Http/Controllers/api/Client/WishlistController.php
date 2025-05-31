<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\WishlistResource;
use App\Models\Wishlist;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;

class WishlistController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the authenticated user's wishlist.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
           //Xác thực token của user
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return $this->error('Vui lòng đăng nhập để xem danh sách yêu thích', [], 401);
            }

            // lấy danh sách wishlists
            $wishlist = Wishlist::where('user_id', $user->id)->with(['product' => function ($query) {
                    $query->where('is_active', 1)->with(['category', 'productItems' => function ($query) {
                        $query->where('is_active', 1)->with(['color', 'size', 'productImages' => function ($query) {
                            $query->where('is_active', 1);
                        }]);
                    }]);
                }])->paginate(10);

           return $this->success(WishlistResource::collection($wishlist), 'Lấy danh sách sản phẩm yêu thích thành công');
        } catch (ValidationException $e) {
            return $this->error('Thông tin không hợp lệ. Vui lòng kiểm tra lại.', $e->errors(), 422);
        } catch (\Throwable $th) {
            return $this->error('Có lỗi xảy ra khi lấy danh sách yêu thích. Vui lòng thử lại sau.', ['error' => $th->getMessage()], 500);
        }
    }

    
    public function store(Request $request)
    {
        try {
           
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return $this->error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích', [], 401);
            }

            // Xét điệu kiện cho product_id 
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            // xét sản phầm có còn hoạt động hay không
            $product = Product::where('id', $validated['product_id'])->where('is_active', 1)->first();
            if (!$product) {
                return $this->error('Sản phẩm không tồn tại hoặc không hoạt động', [], 404);
            }

            // Kiểm tra sản phẩm đã có trong danh sách yêu thích của người dùng chưa
            $existing = Wishlist::where('user_id', $user->id)
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existing) {
                return $this->error('Sản phẩm đã có trong danh sách yêu thích', [], 422);
            }

            //thêm mới sản phẩm vào wishlist
            $wishlist = Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $validated['product_id'],
            ]);

            // sản phẩm liên quan
            $wishlist->load(['product' => function ($query) {
                $query->where('is_active', 1)->with(['category', 'productItems' => function ($query) {
                    $query->where('is_active', 1)->with(['color', 'size', 'productImages' => function ($query) {
                        $query->where('is_active', 1);
                    }]);
                }]);
            }]);

            return $this->success(new WishlistResource($wishlist), 'Thêm sản phẩm vào danh sách yêu thích thành công', 201);
        } catch (ValidationException $e) {
            return $this->error('Thông tin không hợp lệ. Vui lòng kiểm tra lại.', $e->errors(), 422);
        } catch (\Throwable $th) {
            return $this->error('Có lỗi xảy ra khi thêm sản phẩm vào danh sách yêu thích. Vui lòng thử lại sau.', ['error' => $th->getMessage()], 500);
        }
    }

  
    public function destroy($product_id)
    {
        try {
            
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return $this->error('Vui lòng đăng nhập để xóa sản phẩm khỏi danh sách yêu thích', [], 401);
            }

            
            $request = request()->merge(['product_id' => $product_id]);
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            // Tìm sản phẩm trong danh sách
            $wishlist = Wishlist::where('user_id', $user->id)->where('product_id', $product_id)->first();

            if (!$wishlist) {
                return $this->error('Sản phẩm không tồn tại trong danh sách yêu thích', [], 404);
            }

            // Xóa sản phẩm yêu thích trong danh sách
            $wishlist->delete();

            return $this->success(null, 'Xóa sản phẩm khỏi danh sách yêu thích thành công', 200);
        } catch (ValidationException $e) {
            return $this->error('Thông tin không hợp lệ. Vui lòng kiểm tra lại.', $e->errors(), 422);
        } catch (\Throwable $th) {
            return $this->error('Có lỗi xảy ra khi xóa sản phẩm khỏi danh sách yêu thích. Vui lòng thử lại sau.', ['error' => $th->getMessage()], 500);
        }
    }
}