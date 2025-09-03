<?php

namespace App\Http\Controllers\api\Client;

use App\Models\ReturnItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

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
            $gross = $user->orders()
                ->whereIn('status_order_id', [6, 10, 12]) // các trạng thái thành công
                ->sum(DB::raw('total_amount - shipping_price'));

            // tổng tiền đã hoàn lại cho user này
            $refunded = ReturnItem::whereHas('returnRequest', function ($q) use ($user) {
                $q->where('status', 'return_completed')->where('type', 'like', 'partial')
                    ->whereHas('order', fn($oq) => $oq->where('user_id', $user->id));
            })
                ->sum(DB::raw('price * quantity'));
            $memberPoint = $user->memberPoint;
            $data = [
                'id' => $memberPoint->id,
                'total_spent' => $gross - ($refunded ?? 0),
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
