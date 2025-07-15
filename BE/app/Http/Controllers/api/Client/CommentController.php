<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\CommentResource;
use App\Models\Comment;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    //
    use ApiResponse;
    public function index(Request $request)
    {
        $productId = $request->query('product_id');

        if(!$productId) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 422);
        }

        $comment = Comment::with(['user' => function($query){
            $query->select('id','name','avatar');
        }])->where('product_id',$productId)->where('is_active',1)->latest()->paginate(15);

        return CommentResource::collection($comment);
    }

    public function store(Request $request, $productId)
    {
        try{
            $user = JWTAuth::parseToken()->authenticate();

            if($user->is_ban) // is_ban = 1 -> khóa tài khoản
            {
                return $this->error('Tài khoản của bạn đã bị khóa.', [], 403);
            }
            // Kiểm tra các bình luận trùng lặp gần đây
            $recentComment = Comment::where('user_id',$user->id)
            ->where('product_id',$productId)->where('content',$request->content)
            ->where('created_at','>=', now()->subMinutes(10))->exists();

            if($recentComment)
            {
                return response()->json(['message' => 'Bạn đã gửi bình luận tương tự gần đây. Vui lòng thử lại sau.'],422);
            }

            $validate = Validator::make($request->all(),[
                'content' => [
                'required',
                'string',
                'max:200',
                // 'min:5',
                //Hàm check bình luận có phải các đường dẫn http,https,...
                function ($attribute, $value, $fail) {
                    if (preg_match('/http[s]?:\/\//i', $value)) {
                        $fail('Bình luận không được chứa liên kết.');
                    }
                },
            ],
            ],[
                'content.required' => 'Nội dung bình luận là bắt buộc',
                'content.string' => 'Nội dung bình luận phải là chuỗi kí tự',
                'content.max' => 'Nội dung bình luận không vượt quá 200 ký tự',
                // 'content.min' => 'Nội dung bình luận tối thiểu 5 ký tự',
            ]);

            if($validate->fails()){
                return response()->json(['message' => 'Dữ liệu không hợp lệ'],422);
            }

            // Kiểm tra hành vi spam
            $commentCount = Comment::where('user_id',$user->id)
            ->where('created_at', '>=', now()->subHour())->count();

            // Xử lí khi người dùng spam
            if($commentCount >= 10)
            {
                $user->is_ban = 1;
                $user->save();
                return response()->json(['message' => 'Tài khoản của bạn đã bị tạm khóa do gửi quá nhiều bình luận.'], 403);
            }

            $comment = Comment::create([
                'content' => $request->content,
                'user_id' => $user->id,
                'product_id'=>$productId,
                'is_active' => 1,
            ]);

            return $this->success(new CommentResource($comment), 'Thêm bình luận thành công', 201);

        }catch (\Exception $e) {
            return $this->error('Chưa đăng nhập hoặc token không hợp lệ', [], 401);
        }
    }
}
