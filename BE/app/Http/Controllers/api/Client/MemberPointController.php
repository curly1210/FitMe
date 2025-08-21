<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MemberPointController extends Controller
{
    use ApiResponse;
    public function getRank(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->error("Người dùng chưa đăng nhập", [], 403);
            }
            $memberPoint = $user->memberPoint;
            return response()->json($memberPoint);
        } catch (\Throwable $th) {
            return $this->error("Lỗi trong quá trình lấy thông tin thứ hạng", $th->getMessage(), 400);
        }
    }
}
