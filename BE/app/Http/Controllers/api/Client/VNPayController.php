<?php

namespace App\Http\Controllers\api\Client;

use DateTime;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
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
                'cartItems.*.salePrice' => 'required|numeric|min:0',
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
                $vnp_TxnRef = rand(1, 10000); //Mã giao dịch thanh toán tham chiếu của merchant
                $vnp_Amount = $request->input('total_amount'); // Số tiền thanh toán
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

            if ($request->query('vnp_ResponseCode') == '00') {

                $this->createOrder($request, 1);
                return response()->json(['message' => "Thanh toán thành công ", 'vnp_ResponseCode' => $request->query('vnp_ResponseCode')]);
            } else {
                return response()->json(['message' => "Thanh toán không thành công", 'vnp_ResponseCode' => $request->query('vnp_ResponseCode')]);
            }
        } else {
            return response()->json(['message' => "mã bảo mật không hợp lệ"]); // Hiển thị thông báo lỗi nếu mã bảo mật không hợp lệ
        }
    }
}
