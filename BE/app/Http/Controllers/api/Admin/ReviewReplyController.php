<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\ReviewReply;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ReviewReplyResource;
use Illuminate\Support\Facades\Validator;

class ReviewReplyController extends Controller
{
    use ApiResponse;
    /* request:
        content
        review_id
        user_id
    */
    # Tạo phản hồi đánh giá (Admin)
    public function create(Request $request)
    {
        // dd($request->user()->id);
        try {
            if (!$request->user() || !$request->user()->id) {
                return $this->error("Không có quyền truy cập", ["user_id" => "Không tồn tại"], 403);
            }
            $validator = Validator::make($request->only(["content", "review_id"]), [
                "review_id" => "required|exists:reviews,id",
                "content" => "required|string",
            ], [
                'review_id.required' => 'Không tìm thấy đánh giá',
                'review_id.exists' => 'Đánh giá không tồn tại',
                "content.string" => "Nội dung phản hồi phải là một chuỗi kỹ tự",
                "content.required" => "Nội dung phản hồi là bắt buộc",
            ]);
            if ($validator->fails()) {
                return $this->error("Lỗi nhập dữ liệu", $validator->errors(), 422);
            }
            $reply = ReviewReply::create([
                "review_id" => $request->review_id,
                "user_id" => $request->user()->id,
                "content" => $request->content
            ]);
            return $this->success(new ReviewReplyResource($reply), "Tạo phản hồi thành công", 201);
        } catch (\Throwable $th) {
            return $this->error("Lỗi hệ thống", $th->getMessage(), 500);
        }
    }
    /* Request: 
        reply_id
        content
        */
    #Cập nhật phản hồi (admin)
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->only(["content"]), [
                // "reply_id" => "required|exists:reviews,id",
                "content" => "required|string",
            ], [
                // 'reply_id.required' => 'Không tìm thấy đánh giá',
                // 'reply_id.exists' => 'Đánh giá không tồn tại',
                "content.string" => "Nội dung phản hồi phải là một chuỗi kỹ tự",
                "content.required" => "Nội dung phản hồi là bắt buộc",
            ]);
            if ($validator->fails()) {
                return $this->error("Lỗi nhập dữ liệu", $validator->errors(), 422);
            }

            $reply = ReviewReply::find($id);

            $reply->update([
                "content" => $request->content,
            ]);
            $reply->fresh();
            return $this->success(new ReviewReplyResource($reply), "Cập nhật phản hồi thành công", 201);
        } catch (\Throwable $th) {
            return $this->error("Lỗi hệ thống", $th->getMessage(), 500);
        }
    }
    /* Request: reply_id */
    #Đổ dữ liệu update phản hồi (admin)
    public function edit(Request $request)
    {
        try {
            $reply = $reply = ReviewReply::find($request->reply_id);
            if (!$reply) {
                return $this->error("Không tìm thấy phản hồi", [], 404);
            } else if ($request->user()) {
                return $this->error("Người dùng chưa đăng nhập", [], 403);
            }

            return response()->json(new ReviewReplyResource($reply));
        } catch (\Throwable $th) {
            return $this->error("Lỗi hệ thống", $th->getMessage(), 500);
        }
    }
    /* Request: reply_id */
    # Xóa phản hồi (admin)
    public function delete(Request $request, $id)
    {
        try {
            $reply = $reply = ReviewReply::find($id);
            if (!$reply) {
                return $this->error("Không tìm thấy phản hồi", [], 404);
            }
            $reply->delete();
            return $this->success("Xóa thành công");
        } catch (\Throwable $th) {
            return $this->error("Lỗi hệ thống", $th->getMessage(), 500);
        }
    }
}
