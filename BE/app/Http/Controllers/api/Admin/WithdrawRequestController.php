<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Resources\Admin\WithdrawRequestResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\WithdrawRequest;
use App\Traits\CloudinaryTrait;
use App\Models\WalletTransaction;
use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;


class WithdrawRequestController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index(Request $request)
    {
        try {
            $search = $request->search ?? '';
            $query = WithdrawRequest::with(['wallet.user', 'wallet'])->whereHas('wallet.user', function (Builder $q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })->orderBy('id', 'desc');
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
            $data = $query->paginate(10);
            return WithdrawRequestResource::collection($data);
        } catch (\Throwable $th) {
            return $this->error("Lỗi hệ thống", $th->getMessage(), 400);
        }
    }
    public function show($id)
    {
        $withdrawRequest = WithdrawRequest::with(['wallet.user', 'wallet'])->find($id);
        // dd(1);
        if (!$withdrawRequest) {
            return $this->error("Yêu cầu không tồn tại", [], 404);
        }
        return new WithdrawRequestResource($withdrawRequest);
    }
    public function acceptRequest(Request $request)
    {
        $validator = Validator::make($request->only(['wallet_id', 'bill_image', 'request_id']), [
            'wallet_id' => "required|integer",
            'request_id' => "required|integer",

            'bill_image' => "required|file|mimes:jpeg,png,jpg,webp|max:2048"
        ], [

            'wallet_id.required' => "Id ví phải là bắt buộc",
            'request_id.required' => "Id yêu cầu phải là bắt buộc",
            'bill_image.require' => "Ảnh hóa đơn là bắt buộc",
            'bill_image.file' => "Ảnh hóa đơn phải là một tệp",
            'bill_image.mimes' => "Ảnh hóa đơn phải là một tệp có định dạng: jpeg, png, jpg, webp",
            'bill_image.max' => "Ảnh hóa đơn không được lớn hơn 2MB",
        ]);
        if ($validator->fails()) {
            return $this->error("Lỗi truyền dữ liệu", $validator->errors(), 422);
        }
        try {
            $withdrawRequest = WithdrawRequest::where('id', '=', $request->request_id)->first();
            if (!$withdrawRequest) {
                return $this->error("Yêu cầu không tồn tại", [], 404);
            }
            $wallet = Wallet::find($request->wallet_id);
            if (!$wallet) {
                return $this->error("Ví người dùng không tồn tại", [], 404);
            }
            $balanceUpdate = $wallet->balance - $withdrawRequest->amount;

            if ($balanceUpdate < 0) {
                return $this->error("Số dư của ví không đủ để thực hiện hoàn tiền", ['amount' => "Số tiền rút vượt quá số dư"], 422);
            }
            $bill_url = $this->uploadImageToCloudinary($request->file('bill_image', ['quality' => 65, 'folder' => 'uploads-wallet-transaction']));
            if (!$bill_url) {
                return $this->error("Upload ảnh không thành công", [], 422);
            }

            WalletTransaction::where('wallet_id', '=', $request->wallet_id)->create(
                [
                    'wallet_id' => $request->wallet_id,
                    'amount' => $withdrawRequest->amount,
                    'type' => 'withdraw',
                    'bill_url' => $bill_url['public_id'],
                ]
            );
            // dd($balanceUpdate);
            $wallet->update([
                'balance' => $balanceUpdate,
            ]);
            WithdrawRequest::where('id', '=', $request->request_id)->update(['status' => 'accept']);
            return response()->json(['mesage' => "Yêu cầu đã được chấp nhận"]);
        } catch (\Throwable $th) {
            return $this->error("Chuyển trạng thái không thành công", $th->getMessage(), 400);
        }
    }
    public function rejectRequest(Request $request)
    {
        $validator = Validator::make($request->only(['wallet_id', 'request_id', 'reject_reason']), [
            'wallet_id' => "required|integer",
            'request_id' => "required|integer",

            'reject_reason' => "required|string|max:255",
        ], [
            'wallet_id.required' => "id ví phải là kiểu số",
            'request_id.required' => "Id yêu cầu phải là bắt buộc",
            'reject_reason.required' => "Lý do từ chối là bắt buộc",
            'reject_reason.string' => "Lý do từ chối phải là một chuỗi",
            'reject_reason.max' => "Lý do từ chối không được lớn hơn 255 ký tự",
        ]);
        if ($validator->fails()) {
            return $this->error("Lỗi truyền dữ liệu", $validator->errors(), 422);
        }
        try {
            $withdrawRequest = WithdrawRequest::where('id', '=', $request->request_id)->first();
            if (!$withdrawRequest) {
                return $this->error("Yêu cầu không tồn tại", [], 404);
            }
            WalletTransaction::where('wallet_id', '=', $request->wallet_id)->create(
                [
                    'wallet_id' => $request->wallet_id,
                    'amount' => $withdrawRequest->amount,
                    'type' => 'withdraw',
                ]
            );
            WithdrawRequest::where('id', '=', $request->request_id)->update(
                [
                    'status' => 'reject',
                    'reject_reason' => $request->reject_reason
                ]
            );
            return response()->json(['mesage' => "Yêu cầu đã được từ chối"]);
        } catch (\Throwable $th) {
            return $this->error("Chuyển trạng thái không thành công", $th->getMessage(), 400);
        }
    }
}
