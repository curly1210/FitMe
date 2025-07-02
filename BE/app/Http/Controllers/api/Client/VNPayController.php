<?php

namespace App\Http\Controllers\api\Client;

use DateTime;
use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CreateOrderTrait;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class VNPayController extends Controller
{
    use ApiResponse, CreateOrderTrait;
    public function handle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'payment_method' => 'required|string',
                'shipping_address_id' => 'required|exists:shipping_address,id',
                'shipping_price' => 'required|integer|min:0',
                'coupon_code' => 'nullable|string',
                'cartItems' => 'required|array|min:1',
                'cartItems.*.idProduct_item' => 'required|exists:product_items,id',
                'cartItems.*.quantity' => 'required|integer|min:1',
                'cartItems.*.idItem' => 'required|exists:cart_items,id',
                'cartItems.*.price' => 'required|numeric|min:0',

                'cartItems.*.sale_price' => 'required|numeric|min:0',
                'cartItems.*.sale_percent' => 'required|numeric|min:0',
                'cartItems.*.image_product' => 'required|string',
                'total_price_cart' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',

            ], [
                'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
                'payment_method.string' => 'Phương thức thanh toán phải là một chuỗi.',
                'shipping_address_id.required' => 'Địa chỉ giao hàng là bắt buộc.',
                'shipping_address_id.exists' => 'Địa chỉ giao hàng không tồn tại.',
                'shipping_price.required' => 'Phí vận chuyển là bắt buộc.',
                'shipping_price.integer' => 'Phí vận chuyển phải là một số nguyên.',
                'shipping_price.min' => 'Phí vận chuyển tối thiểu là 0.',
                'coupon_code.string' => 'Mã giảm giá phải là một chuỗi.',
                'cartItems.required' => 'Danh sách sản phẩm trong giỏ hàng là bắt buộc.',
                'cartItems.array' => 'Danh sách sản phẩm trong giỏ hàng phải là một mảng.',
                'cartItems.min' => 'Giỏ hàng phải có ít nhất một sản phẩm.',
                'cartItems.*.idProduct_item.required' => 'ID sản phẩm là bắt buộc.',
                'cartItems.*.idProduct_item.exists' => 'Sản phẩm không tồn tại.',
                'cartItems.*.quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
                'cartItems.*.quantity.integer' => 'Số lượng sản phẩm phải là một số nguyên.',
                'cartItems.*.quantity.min' => 'Số lượng sản phẩm tối thiểu là 1.',
                'cartItems.*.idItem.required' => 'ID mặt hàng giỏ hàng là bắt buộc.',
                'cartItems.*.idItem.exists' => 'Mặt hàng giỏ hàng không tồn tại.',
                'cartItems.*.salePrice.required' => 'Giá bán của sản phẩm là bắt buộc.',
                'cartItems.*.salePrice.numeric' => 'Giá bán của sản phẩm phải là một số.',
                'cartItems.*.salePrice.min' => 'Giá bán của sản phẩm tối thiểu là 0.',
                'total_price_cart.required' => 'Tổng giá trị giỏ hàng là bắt buộc.',
                'total_price_cart.numeric' => 'Tổng giá trị giỏ hàng phải là một số.',
                'total_price_cart.min' => 'Tổng giá trị giỏ hàng tối thiểu là 0.',
                'discount.numeric' => 'Giá trị giảm giá phải là một số.',
                'discount.min' => 'Giá trị giảm giá tối thiểu là 0.',
                'total_amount.required' => 'Số tiền thanh toán là bắt buộc.',
                'total_amount.numeric' => 'Số tiền thanh toán phải là một số.',
                'total_amount.min' => 'Số tiền thanh toán tối thiểu là 0.',
            ]);
            if (!$validator->fails()) {
                do {
                    $uniqueCode = 'OD' . now()->format('ymd') . strtoupper(Str::random(6));
                } while (Order::where('orders_code', $uniqueCode)->exists());
                $vnp_TxnRef = $uniqueCode; //Mã giao dịch thanh toán tham chiếu của merchant
                $vnp_Amount = $request->input('total_amount'); // Số tiền thanh toán
                $vnp_Locale = "vn"; //Ngôn ngữ chuyển hướng thanh toán
                $vnp_BankCode = "NCB"; //Mã phương thức thanh toán
                $vnp_IpAddr = $request->ip(); //IP Khách hàng thanh toán
                $vnp_HashSecret = env('VNP_HASH_SECRET');
                // $vnp_IpAddr = $_SERVER['REMOTE_ADDR']; 
                $startTime = date("YmdHis");
                $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));
                $vnp_CreateDate =  date("YmdHis");
                $inputData = array(
                    "vnp_Version" => "2.1.0",
                    "vnp_TmnCode" => env('VNP_TMNCODE'), //Mã định danh của merchant
                    "vnp_Amount" => $vnp_Amount * 100,
                    "vnp_Command" => "pay",
                    "vnp_CreateDate" => $vnp_CreateDate,
                    "vnp_CurrCode" => "VND",
                    "vnp_IpAddr" => $vnp_IpAddr,
                    "vnp_Locale" => $vnp_Locale,
                    "vnp_OrderInfo" => "Thanh toan GD:" . $vnp_TxnRef . '-' . $vnp_CreateDate,
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
        // return response()->json($request->all());
        $vnp_SecureHash = $request->query('vnp_SecureHash') ?? ($_GET['vnp_SecureHash'] ?? null);
        // return response()->json($request->query());
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

            if ($request->query('vnp_ResponseCode') == '00') {
                $vnp_TxnRef = $request->input("vnp_TxnRef"); // Lấy mã tham chiếu giao dịch của bạn
                $vnp_TransactionNo =  $request->vnp_TransactionNo; // Lấy mã giao dịch của VNPay
                $order_info = $request->query('vnp_OrderInfo');
                $vnp_TransactionDate = explode('-', $order_info)[1];
                // return response()->json($request->all());
                $request->merge([
                    'orders_code' => $vnp_TxnRef,
                    'bank_code' => $vnp_TransactionNo,
                    'transaction_at' => $vnp_TransactionDate
                ]);
                // return response()->json($request->all());
                $this->createOrder($request, 1,); // 1 - đã thanh toán , 2 - Chờ hoàn tiền , 3 - Đã hoàn tiền   
                // return response()->json($order);
                return response()->json(['message' => "Thanh toán thành công ", 'vnp_ResponseCode' => $request->query('vnp_ResponseCode')]);
            } else {
                return response()->json(['message' => "Thanh toán không thành công", 'vnp_ResponseCode' => $request->query('vnp_ResponseCode')]);
            }
        } else {
            return response()->json(['message' => "mã bảo mật không hợp lệ"]); // Hiển thị thông báo lỗi nếu mã bảo mật không hợp lệ
        }
    }
    function callAPI_auth($method, $url, $data)
    {
        $curl = curl_init();
        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);
                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }
        // OPTIONS:
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        // EXECUTE:
        $result = curl_exec($curl);
        if (!$result) {
            die("Connection Failure");
        }
        curl_close($curl);
        return $result;
    }
    public function vnpayQuery(Request $request)
    {
        if ($request->orders_code == null || $request->orders_code == '') {
            return response()->json(['message' => 'Mã giao dịch'], 422);
        }
        if (request()->isMethod('post')) {
            $vnp_RequestId = uniqid('RQ'); // Mã truy vấn
            $vnp_Command = "querydr"; // Mã api
            $vnp_TxnRef = $request->orders_code; // Mã tham chiếu của giao dịch
            $vnp_OrderInfo = "Truy vấn giao dịch"; // Mô tả thông tin
            //$vnp_TransactionNo= ; // Tuỳ chọn, Mã giao dịch thanh toán của CTT VNPAY
            $vnp_TransactionDate =  Order::query()->where('orders_code', $vnp_TxnRef)->first('transaction_at'); // Thời gian ghi nhận giao dịch
            $vnp_CreateDate = date('YmdHis'); // Thời gian phát sinh request
            $vnp_IpAddr = request()->ip();


            $datarq = array(
                "vnp_RequestId" => $vnp_RequestId,
                "vnp_Version" => "2.1.0",
                "vnp_Command" => $vnp_Command,
                "vnp_TmnCode" => env("VNP_TMNCODE"),
                "vnp_TxnRef" => $vnp_TxnRef,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                //$vnp_TransactionNo= ; 
                "vnp_TransactionDate" => $vnp_TransactionDate,
                "vnp_CreateDate" => $vnp_CreateDate,
                "vnp_IpAddr" => $vnp_IpAddr
            );

            $format = '%s|%s|%s|%s|%s|%s|%s|%s|%s';

            $dataHash = sprintf(
                $format,
                $datarq['vnp_RequestId'], //1
                $datarq['vnp_Version'], //2
                $datarq['vnp_Command'], //3
                $datarq['vnp_TmnCode'], //4
                $datarq['vnp_TxnRef'], //5
                $datarq['vnp_TransactionDate'], //6
                $datarq['vnp_CreateDate'], //7
                $datarq['vnp_IpAddr'], //8
                $datarq['vnp_OrderInfo'] //9
            );

            $checksum = hash_hmac('SHA512', $dataHash, env("VNP_HASH_SECRET"));
            $datarq["vnp_SecureHash"] = $checksum;
            $txnData = $this->callAPI_auth("POST", env("API_URL"), json_encode($datarq));
            $ispTxn = json_decode($txnData, true);

            return response()->json($ispTxn);
        }
    }
    public function vnpayRefund(Request $request)
    {
        if (request()->isMethod('post')) {

            do {
                $uniqueCode =  now()->format('ymd') . strtoupper(Str::random(6));
            } while (Order::where('orders_code', $uniqueCode)->exists());
            $vnp_TxnRef = $request->order_code; // Mã tham chiếu của giao dịch
            $order = Order::query()->where('orders_code', $vnp_TxnRef)->first();
            if (!$order || $vnp_TxnRef == null) {
                return $this->error("Không tìm thấy đơn hàng", [], 404);
            }
            if ($order->payment_method == 'cod') {
                return $this->error("Yêu cầu hoàn tiền chỉ áp dụng với đơn hàng thanh toán online", 422);
            }

            if ($order->status_order_id != 7 || $order->status_payment == 0 || !$order->bank_code || !$order->transaction_at) {
                return $this->error("Đơn hàng không đủ điều kiện hoàn tiền", ["status_order" => "Đơn hàng không ở trạng thái hủy", "bank_code" => "mã đơn thanh toán là bắt buộc", "transaction_at" => "Thời gian thanh toán là bắt buộc"], 422);
            }
            $vnp_RequestId = $uniqueCode; // Mã truy vấn
            $vnp_Command = "refund"; // Mã api
            $vnp_TransactionType = '02'; // 02 hoàn trả toàn phần - 03 hoàn trả một phần

            $vnp_Amount = $order->total_amount * 100; // Số tiền hoàn trả
            $vnp_OrderInfo = "Hoan Tien Giao Dich"; // Mô tả thông tin
            $vnp_TransactionNo = $order->bank_code; // Tuỳ chọn, "0": giả sử merchant không ghi nhận được mã GD do VNPAY phản hồi.
            $vnp_TransactionDate = date('YmdHis', strtotime($order->transaction_at));
            // dd($vnp_TransactionDate);

            $vnp_CreateDate = date('YmdHis'); // Thời gian phát sinh request
            $vnp_CreateBy = $request->user()->name ?? 'system';
            $vnp_IpAddr =  request()->ip();

            $ispTxnRequest = array(
                "vnp_RequestId" => $vnp_RequestId,
                "vnp_Version" => "2.1.0",
                "vnp_Command" => $vnp_Command,
                "vnp_TmnCode" => env('VNP_TMNCODE'),
                "vnp_TransactionType" => $vnp_TransactionType,
                "vnp_TxnRef" => $vnp_TxnRef,
                "vnp_Amount" => $vnp_Amount,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_TransactionNo" => $vnp_TransactionNo,
                "vnp_TransactionDate" => $vnp_TransactionDate,
                "vnp_CreateDate" => $vnp_CreateDate,
                "vnp_CreateBy" => $vnp_CreateBy,
                "vnp_IpAddr" => $vnp_IpAddr
            );
            // dd($ispTxnRequest);

            $format = '%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s';

            $dataHash = sprintf(
                $format,
                $ispTxnRequest['vnp_RequestId'], //1
                $ispTxnRequest['vnp_Version'], //2
                $ispTxnRequest['vnp_Command'], //3
                $ispTxnRequest['vnp_TmnCode'], //4
                $ispTxnRequest['vnp_TransactionType'], //5
                $ispTxnRequest['vnp_TxnRef'], //6
                $ispTxnRequest['vnp_Amount'], //7
                $ispTxnRequest['vnp_TransactionNo'],  //8
                $ispTxnRequest['vnp_TransactionDate'], //9
                $ispTxnRequest['vnp_CreateBy'], //10
                $ispTxnRequest['vnp_CreateDate'], //11
                $ispTxnRequest['vnp_IpAddr'], //12
                $ispTxnRequest['vnp_OrderInfo'] //13
            );

            $checksum = hash_hmac('SHA512', $dataHash, env('VNP_HASH_SECRET'));
            $ispTxnRequest["vnp_SecureHash"] = $checksum;
            $txnData = $this->callAPI_auth("POST", env("API_URL"), json_encode($ispTxnRequest));
            $ispTxn = json_decode($txnData, true);


            if ($ispTxn["vnp_ResponseCode"] == "00") {

                $order->update(["status_payment" => 3]); # Đã hoàn tiền
                return response()->json(["message" => "Hoàn tiền thành công"]);
            } else {
                return response()->json(["message" => "Hoàn tiền thất bại", "response_code" => $ispTxn["vnp_ResponseCode"]], 400);
            }
        }
    }
}
