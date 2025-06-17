<?php

namespace App\Http\Controllers\api\Client;

use DateTime;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class VNPayController extends Controller
{
    use ApiResponse;
    public function handle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:1000',

            ], [
                'amount.required' => 'Số tiền thanh toán là bắt buộc.',
                'amount.numeric' => 'Số tiền thanh toán phải là một số.',
                'amount.min' => 'Số tiền thanh toán tối thiểu là 1000.',
            ]);
            if (!$validator->fails()) {
                $vnp_TxnRef = rand(1, 10000); //Mã giao dịch thanh toán tham chiếu của merchant
                $vnp_Amount = $request->input('amount'); // Số tiền thanh toán
                $vnp_Locale = "vn"; //Ngôn ngữ chuyển hướng thanh toán
                $vnp_BankCode = "NCB"; //Mã phương thức thanh toán
                $vnp_IpAddr = $request->ip(); //IP Khách hàng thanh toán
                $vnp_HashSecret = env('VNP_HASH_SECRET');
                // $vnp_IpAddr = $_SERVER['REMOTE_ADDR']; 
                $startTime = date("YmdHis");
                $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));
                $inputData = array(
                    "vnp_Version" => "2.1.0",
                    "vnp_TmnCode" => env('VNP_TMNCODE'), //Mã định danh của merchant
                    "vnp_Amount" => $vnp_Amount * 100,
                    "vnp_Command" => "pay",
                    "vnp_CreateDate" => date('YmdHis'),
                    "vnp_CurrCode" => "VND",
                    "vnp_IpAddr" => $vnp_IpAddr,
                    "vnp_Locale" => $vnp_Locale,
                    "vnp_OrderInfo" => "Thanh toan GD:" . $vnp_TxnRef,
                    "vnp_OrderType" => "other",
                    "vnp_ReturnUrl" => env('VNP_RETURN_URL'),
                    "vnp_TxnRef" => $vnp_TxnRef,
                    "vnp_ExpireDate" => $expire
                );

                if (isset($vnp_BankCode) && $vnp_BankCode != "") {
                    $inputData['vnp_BankCode'] = $vnp_BankCode;
                }

                ksort($inputData);
                $query = "";
                $i = 0;
                $hashdata = "";
                foreach ($inputData as $key => $value) {
                    if ($i == 1) {
                        $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                    } else {
                        $hashdata .= urlencode($key) . "=" . urlencode($value);
                        $i = 1;
                    }
                    $query .= urlencode($key) . "=" . urlencode($value) . '&';
                }

                $vnp_Url = env('VNP_URL') . "?" . $query;
                if (isset($vnp_HashSecret)) {
                    $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //  
                    $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
                }
                return response()->json(["message" => "Chuyển hướng thành công", 'vnp_Url' => $vnp_Url]);
                // header('Location: ' . $vnp_Url);
            } else {
                return $this->error("Dữ liệu không hợp lệ", $validator->errors(), 422);
            }
        } catch (\Throwable $e) {
            return $this->error('Lỗi hệ thống', $e->getMessage(), 500);
        }
    }
    public function vnpayReturn(Request $request)
    {
        $vnp_SecureHash = $request->query('vnp_SecureHash');
        $inputData = array();
        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, env('VNP_HASH_SECRET'));
        if ($secureHash == $vnp_SecureHash) {
            $dataReturn = [
                "order_code" => $request->query('vnp_TxnRef'), //Mã đơn hàng
                "amount" => $request->query('vnp_Amount') / 100, // Chia cho 100 để chuyển đổi từ đồng sang tiền tệ
                "content" => $request->query('vnp_OrderInfo'), // Nội dung thanh toán
                "response_code" => $request->query('vnp_ResponseCode'), // Mã phản hồi từ VNPay
                "transaction_code" => $request->query('vnp_TransactionNo'), // Mã giao dịch từ VNPay
                "bank_code" => $request->query('vnp_BankCode'), // Mã ngân hàng
                "pay_date" => DateTime::createFromFormat('YmdHis', $request->query('vnp_PayDate'))->format('Y-m-d H:i:s'), // Ngày thanh toán
            ];
            if ($request->query('vnp_ResponseCode') == '00') {
                $dataReturn['status'] = "success"; // Trạng thái giao dịch thành công

            } else {
                $dataReturn['status'] = "fail"; // Trạng thái giao dịch thành công
            }
        } else {
            $dataReturn['status'] = "invalid"; // Hiển thị thông báo lỗi nếu mã bảo mật không hợp lệ
        }
        return response()->json($dataReturn);
    }
}
