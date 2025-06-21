<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Resources\Admin\CommentResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    //
    use ApiResponse;
    public function show($id)
    {
        $product = Product::with(['comments.user', 'productItems', 'productImages'])->findOrFail($id);
        return response()->json(new CommentResource($product));
    }

    public function delete($id)
    {
        try {
            //code...
            $comment = Comment::findOrFail($id);

            //Kiểm tra role
            // if(Auth::user()->role !== 'Admin'){
            //     return response()->json([
            //         'message' => 'Bạn không có quyền xóa bình luận này'
            //     ],403);
            // }

            $comment->delete();

            return response()->json([
                'message' => 'Bình luận đã được xóa'
            ],200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa bình luận'
            ], 500);
        }
    }

    public function toggleVisibility($id)
    {
        try {
            //code...
            $comment = Comment::findOrFail($id);

            // if (Auth::user()->role !== 'Admin') {
            //     return response()->json([
            //         'message' => 'Chỉ admin mới có quyền thực hiện hành động này'
            //     ], 403);
            // }

            $comment->is_active = !$comment->is_active;
            $comment->save();

            return response()->json([
                'message' => $comment->is_active ? 'Bình luận đã được hiển thị' : 'Bình luận đã được ẩn',
                'is_active' => $comment->is_active
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi thay đổi trạng thái bình luận'
            ], 500);
        }
    }
}
