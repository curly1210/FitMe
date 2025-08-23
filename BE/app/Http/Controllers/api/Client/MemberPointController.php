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
            $data = [
                'id' => $memberPoint->id,
                'total_spent' => $user->orders->where('status_order_id', '=', 6)->sum('total_amount'),
                'point' => $memberPoint->point,
                'rank' => $memberPoint->rank,
                'value' => $memberPoint->value,
                'last_order_date' => $memberPoint->last_order_date,
                'last_rank_deduction_at' => $memberPoint->last_rank_deduction_at,
                'created_at' => $memberPoint->created_at,
                'updated_at' => $memberPoint->updated_at,

            ];
            return response()->json($data);
        } catch (\Throwable $th) {
            return $this->error("Lỗi trong quá trình lấy thông tin thứ hạng", $th->getMessage(), 400);
        }
    }
}
