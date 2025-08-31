<?php

namespace App\Http\Controllers\api\Client;

use FFI\CType;
use App\Traits\ApiResponse;

use Illuminate\Http\Request;
use App\Models\WalletTransaction;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\WalletTransactionResource;
use App\Models\User;
use App\Notifications\CreateRequestWithdraw;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Carbon;

class WalletTransactionController extends Controller
{
    use ApiResponse;
    public function index(Request $request)
    {
        $user = $request->user() ?? null;
        $perPage = $request->input('per_page', 10);
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $walletId = $user->wallet->id;

        // $transactions = WalletTransaction::where('wallet_id', $walletId)->orderBy('id', 'desc')->paginate(8);


        $query = WalletTransaction::where('wallet_id', $walletId)->orderBy('id', 'desc');
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        switch ($request->status) {

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

        $transactions = $query->paginate($perPage);


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
            return $this->error('Lỗi nhập dữ liệu', ['can_withdraw' => $checkRequest['message']], 422);
        } else if ($checkRequest['can_withdraw'] == 1) {
            try {
                $walletTransaction = WalletTransaction::create([
                    'wallet_id' => $walletId,
                    'amount' => $request->amount,
                    'type' => 'withdraw',
                ]);

                $user->notify(new CreateRequestWithdraw($user->id, $walletTransaction->id, '<span>
                            Gửi yêu cầu 
                            <span style="color:red;font-weight:bold;">' .
                    'hoàn tiền' . '
                            </span>
                            trong ví thành công 
                          </span>'));

                $admins = User::where('role', 'Admin')->get();

                Notification::send($admins, new CreateRequestWithdraw($user->id, $walletTransaction->id, '<span>
                            Khách hàng
                            <span style="color:red;font-weight:bold;">' .
                    $user->name . '
                            </span>
                            gửi yêu cầu hoàn tiền trong ví 
                          </span>', 1));

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
