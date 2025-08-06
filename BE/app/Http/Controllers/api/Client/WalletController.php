<?php

namespace App\Http\Controllers\api\Client;

use App\Models\Wallet;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use App\Models\WithdrawRequest;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    use ApiResponse;
    public function checkWalletExist(Request $request)
    {
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if ($user->wallet) {
            return response()->json(['has_wallet' => true]);
        } else {
            return response()->json(['has_wallet' => false]);
        }
    }
    public function index(Request $request)
    {
        try {
            $user = $request->user() ?? null;
            if (!$user) {
                return $this->error('Người dùng chưa đăng nhập', [], 403);
            }
            if (!$user->wallet) {
                return $this->error('Tài khoản chưa thiết lập ví', [], 404);
            }
            $wallet = $user->wallet;
            //  Giải mã số tài khoản
            $decrypted = Crypt::decryptString($wallet->account_number);
            $length = strlen($decrypted); // độ dài STK
            $lastDigits = substr($decrypted, -4); // 4 ký tự cuối
            $account_number = str_repeat('*', $length - 4) . $lastDigits; #chuỗi hoàn chỉnh
            $data = [
                'bank_name' => $wallet->bank_name,
                'account_number' => $account_number,
                'account_holder' => $wallet->account_holder,
                'balance' => $wallet->balance,
            ];
            return response()->json($data);
        } catch (\Throwable $th) {
            return $this->error('Lỗi hệ thống', $th->getMessage(), 400);
        }
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->only(['bank_name', 'account_number', 'account_holder']), [
            'bank_name' => "string|required|max:50",
            'account_number' => "string|required|max:20",
            'account_holder' => "string|required|max:100",
        ], [
            'bank_name.required' => 'Tên ngân hàng không được bỏ trống.',
            'bank_name.max' => 'Tên ngân hàng tối đa 50 ký tự.',
            'account_number.required' => 'Số tài khoản không được bỏ trống.',
            'account_number.max' => 'Số tài khoản tối đa 20 ký tự.',
            'account_holder.required' => 'Tên chủ tài khoản không được bỏ trống.',
            'account_holder.max' => 'Tên chủ tài khoản tối đa 100 ký tự.',
        ]);
        if ($validator->fails()) {
            return $this->error("Lỗi validate", $validator->errors(), 422);
        }
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        $numberEncode = Crypt::encryptString($request->account_number);
        try {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'bank_name' => $request->bank_name,
                'account_number' => $numberEncode,
                'account_holder' => $request->account_holder,
            ]);
            return $this->success($wallet, "Thiết lập ví thành công", 201);
        } catch (\Throwable $th) {
            return $this->error("Lỗi validate", $th->getMessage(), 422);
        }
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->only(['bank_name', 'account_number', 'account_holder']), [
            'bank_name' => "string|required|max:50",
            'account_number' => "string|required|max:255",
            'account_holder' => "string|required|max:100",
        ], [
            'bank_name.required' => 'Tên ngân hàng không được bỏ trống.',
            'bank_name.max' => 'Tên ngân hàng tối đa 50 ký tự.',
            'account_number.required' => 'Số tài khoản không được bỏ trống.',
            'account_number.max' => 'Số tài khoản tối đa 255 ký tự.',
            'account_holder.required' => 'Tên chủ tài khoản không được bỏ trống.',
            'account_holder.max' => 'Tên chủ tài khoản tối đa 100 ký tự.',
        ]);
        if ($validator->fails()) {
            return $this->error("Lỗi validate", $validator->errors(), 422);
        }
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $numberEncode = Crypt::encryptString($request->account_number);
        try {
            $wallet = Wallet::where('user_id', $user->id)->first();
            $wallet->update([
                'bank_name' => $request->bank_name,
                'account_number' => $numberEncode,
                'account_holder' => $request->account_holder,
            ]);
            $wallet->refresh();
            return $this->success($wallet, "Thiết lập ví thành công", 201);
        } catch (\Throwable $th) {
            return $this->error("Lỗi validate", $th->getMessage(), 422);
        }
    }
    public function getWalletTransaction(Request $request)
    {
        $user = $request->user() ?? null;
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        if (!$user->wallet) {
            return $this->error('Tài khoản chưa thiết lập ví', [], 404);
        }
        $walletId = $user->wallet->id;
        $transactions = WalletTransaction::where('wallet_id', $walletId)->orderBy('desc')->paginate(8);
        if ($transactions->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'Lịch sử ví trống'], 200);
        }
        return response()->json($transactions);
    }
}
