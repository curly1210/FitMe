<?php

namespace App\Http\Controllers\api\Client;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\WithdrawRequest;
use App\Http\Controllers\Controller;

class WithdrawRequestController extends Controller
{
    use ApiResponse;
    public function index(Request $request)
    {
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $walletId = $user->wallet->id;
        $withdrawRequests = WithdrawRequest::where('wallet_id', $walletId)->orderBy('id', 'desc')->paginate(8);
        if ($withdrawRequests->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'Chưa có yêu cầu nào'], 200);
        }
        return response()->json($withdrawRequests);
    }
    public function store(Request $request)
    {
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $walletId = $user->wallet->id;
        $balance = $user->wallet->balance;
        $amount = $request->amount ?? null;
        if (!$amount || $amount < 10000) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút tối thiểu là 10000"], 422);
        } else if ($amount > $balance) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút vượt quá số dư"], 422);
        }
        $checkRequest = $this->checkRequest($request)->original;
        if ($checkRequest['can_withdraw'] == 0) {
            return response()->json($checkRequest, 422);
        } else if ($checkRequest['can_withdraw'] == 1) {
            try {
                $withdrawRequest = WithdrawRequest::create([
                    'wallet_id' => $walletId,
                    'amount' => $request->amount,
                    'status' => 'pending'
                ]);
                return $this->success($withdrawRequest, "Tạo yêu cầu thành công", 201);
            } catch (\Throwable $th) {
                return $this->error("Lỗi validate", $th->getMessage(), 422);
            }
        } else {
            return $this->checkRequest($request);
        }
    }
    public function checkRequest(Request $request)
    {
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $is_request = $user->wallet->withdrawRequests->where('status', 'pending')->first();
        if ($is_request) {
            return response()->json([
                'can_withdraw' => 0,
                'message' => 'Bạn đã có yêu cầu rút tiền đang chờ xử lý.'
            ]);
        } else {
            return response()->json([
                'can_withdraw' => 1,
            ]);
        }
    }
}
