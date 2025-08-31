<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Resources\Client\WalletTransactionResource;
use FFI\CType;
use App\Traits\ApiResponse;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\WalletTransaction;
use App\Http\Controllers\Controller;

class WalletTransactionController extends Controller
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
        $query = WalletTransaction::where('wallet_id', $walletId)->orderBy('id', 'desc');
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }
        switch ($request->fill) {
            case 'pending':
                $query->where('status', 'like', 'pending');
                break;
            case 'reject':
                $query->where('status', 'like', 'reject');
                break;
            case 'accept':
                $query->where('status', 'like', 'accept');
                break;
        }
        $transactions = $query->paginate(8);
        if ($transactions->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'Lịch sử ví trống'], 200);
        }

        return WalletTransactionResource::collection($transactions);
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
        if (!$request->amount) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút không hợp lệ"], 422);
        }
        $amount = $request->amount ?? null;
        if (!$amount || $amount < 10000) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút tối thiểu là 10.000"], 422);
        } else if ($amount > $balance) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút vượt quá số dư"], 422);
        } else if ($amount > 5000000) {
            return $this->error('Lỗi nhập dữ liệu', ['amount' => "Số tiền rút tối đa là 5.000.000"], 422);
        }
        $checkRequest = $this->checkRequest($request)->original;
        if ($checkRequest['can_withdraw'] == 0) {
            return response()->json($checkRequest, 422);
        } else if ($checkRequest['can_withdraw'] == 1) {
            try {
                $walletTransaction = WalletTransaction::create([
                    'wallet_id' => $walletId,
                    'amount' => $request->amount,
                    'type' => 'withdraw',
                ]);
                return $this->success($walletTransaction, "Tạo yêu cầu thành công", 201);
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
        $is_request = $user->wallet->walletTransactions->where('status', 'pending')->first();
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
