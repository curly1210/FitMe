<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Client\WardResource;

use App\Http\Resources\Client\StoreResource;
use App\Http\Resources\Client\ServiceResource;
use App\Http\Resources\Client\DistrictResource;
use App\Http\Resources\Client\ProvinceResource;

class GhnController extends Controller
{
    use ApiResponse;
    public function createOrder(Request $request)
    {
        $order = Order::find($request->order_code);
        if (!$order) {
            return $this->error("Quá trình đăng đơn thất bại", ["Không tìm thấy đơn hàng"], 404);
        }
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "ShopId" => env('GHN_SHOP_ID'),
            "Token" => env('GHN_TOKEN'),
        ])->post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
            [
                "payment_type_id" => 2, # 1 : người bán thanh toán phí vận chuyển  | 2: người mua thanh toán phí vận chuyển
                "note" => "Tintest 123", # Ghi chú cho shipper
                "required_note" => "KHONGCHOXEMHANG", # shipper đưa nguyên hộp, khách nhận rồi mới mở được.
                # Thông tin shop
                "from_name" => "FITME",
                "from_phone" => "0396036363",
                "from_address" => " 69 Tòa nhà Rivera Park , Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội, Việt Nam",
                "from_ward_name" => "Phường Thanh Xuân Trung",
                "from_district_name" => " Quận Thanh Xuân",
                "from_province_name" => "Hà Nội",
                # Thông tin người hoàn trả hàng (nullable)
                "return_phone" => "0332190444",
                "return_address" => "39 NTT",
                "return_district_id" => null,
                "return_ward_code" => "",
                # Thông tin người nhận
                "client_order_code" => $order->order_code,
                "to_name" => $order->recipient_name,
                "to_phone" => $order->recipient_phone,
                "to_address" => $order->receiving_address,
                "to_ward_code" => "20308",
                "to_district_id" => 1444,
                "cod_amount" => $order->total_amount, // Tiền hàng + tiền ship
                "content" => "Đơn hàng đặt từ hệ thống FITME",
                # Lưu ý
                # Kích thước gói hàng của đơn hàng 
                "weight" => 200,
                "length" => 1,
                "width" => 19,
                "height" => 10,
                // -----
                // "pick_station_id"=> 1444,
                // "deliver_station_id"=> null,
                // "insurance_value"=> 10000000,
                // "service_id"=> 0,
                // "service_type_id"=>2,
                // "coupon"=>null,
                // "pick_shift"=>[2],
                // "items"=> [
                //      {
                //          "name"=>"Áo Polo",
                //          "code"=>"Polo123",
                //          "quantity"=> 1,
                //          "price"=> 200000,
                //          "length"=> 12,
                //          "width"=> 12,
                //          "height"=> 12,
                //          "weight"=> 1200,
                //          "category"=> 
                //          {
                //              "level1"=>"Áo",
                //          }
                //      }

            ],
        );
        return response()->json($response->json());
    }
    # Lấy danh sách Tỉnh
    public function getProvince()
    {
        // dd(env('GHN_TOKEN'));
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "Token" => env('GHN_TOKEN'),
        ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province");
        $data = $response->json();
        if ($response['code'] == 200) {
            $filtered = array_filter($data['data'], function ($item) {
                return isset($item['IsEnable']);
            });
            array_shift($filtered);
            return ProvinceResource::collection($filtered);
        }
        return $response->json();
    }
    # Lấy danh sách Quận/Huyện
    public function getDistrict(Request $request)
    {
        if ($request->province_id) {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
                "token" => env('GHN_TOKEN'),
            ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district", [
                "province_id" => $request->province_id
            ]);
            if ($response['code'] == 200) {
                return DistrictResource::collection($response['data']);
            }
            return $response->json();
        }
        return $this->error("Không có mã tỉnh", ["province_id" => "Không có dữ liệu"], 422);
    }
    # Lấy danh sách phường 
    public function getWard(Request $request)
    {
        if ($request->district_id) {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
                "token" => env('GHN_TOKEN'),
            ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id", [
                "district_id" => $request->district_id
            ]);
            // dd($response->json());
            if ($response['code'] == 200) {
                return WardResource::collection($response['data']);
            };
            return $response->json();
        }
        return $this->error("Không có mã tỉnh", ["province_id" => "Không có dữ liệu"], 422);
    }
    public function getStore()
    {
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "token" => env('GHN_TOKEN'),
        ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/all", [
            "offset" => 0,
            "limit" => 50,
            "client_phone" => ""
        ]);
        if ($response['code'] == 200) {
            return StoreResource::collection($response['data']['shops']);
        };
        return $response->json();
    }
    public function getService(Request $request)
    {
        if (!$request->from_district || !$request->to_district) {
            return $this->error("Thiếu dữ liệu giao hàng", ['from_district' => "Mã huyện của kho hoặc cửa hàng là bắt buộc", "to_district" => "Mã huyện nơi nhận hàng là bắt buộc"]);
        }
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "token" => env('GHN_TOKEN'),
        ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services", [
            "shop_id" => env("GHN_SHOP_ID"),
            "from_district" => $request->from_district,
            "to_district" => $request->to_district
        ]);
        // dd($response->json());
        if ($response['code'] == 200) {
            return ServiceResource::collection($response['data']);
        };
        return $response->json();
    }
    public function calculateFee(Request $request)
    {
        $validator =  Validator::make(
            $request->only(["from_district", "from_ward_code", "to_district_id", "to_ward_code", "length", "width", "height", "weight", "total_amount", "items"]),
            [


                "from_ward_code"  => "required|string",
                "to_district_id"  => "required|integer",
                "to_ward_code"    => "required|string",
                "length"          => "nullable|numeric",
                "width"           => "nullable|numeric",
                "height"          => "nullable|numeric",
                "weight"          => "nullable|numeric",
                "total_amount"    => "required|numeric|min:0",
                "items"           => "required|array|min:1",
                "items.*.name"    => "required|string",
                "items.*.quantity" => "required|integer|min:1",
            ],
            [
                "required" => ":attribute không được để trống.",
                "numeric"  => ":attribute phải là số.",
                "integer"  => ":attribute phải là số nguyên.",
                "array"    => ":attribute phải là mảng.",
                "min"      => ":attribute tối thiểu :min.",
            ]
        );
        if ($validator->fails()) {
            return $this->error("Lỗi truyền dữ liệu", $validator->errors(), 422);
        }

        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "token" => env('GHN_TOKEN'),
            "ShopId" => env("GHN_SHOP_ID"),
        ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", [
            "service_id" => 100039,
            "service_type_id" => 5, // 2 : Hàng nhẹ ,  5 : hàng nặng
            "from_ward_code" => $request->from_ward_code,
            "to_district_id" => $request->to_district_id,
            "to_ward_code" => $request->to_ward_code,
            "length" => $request->length ?? 1, // tổng chiều dài
            "width" => $request->width ?? 1,  //tổng chiều rộng
            "height" => $request->height ?? 1, // tổng chiều cao
            "weight" => $request->weight ?? 1, // Tổng cân nặng
            "insurance_value" => $request->total_amount, #Phí đền bù khi đóng bảo hiểm
            "coupon" => null,
            "items" => collect($request->items)->map(function ($item) use ($request) {
                return [
                    "name" => $item['name'],
                    "quantity" => $item['quantity'],
                    "length" => $item['length'], // tổng chiều dài
                    "width" => $item['width'],  //tổng chiều rộng
                    "height" => $item['height'], // tổng chiều cao
                    "weight" => $item['weight'], // Tổng cân nặng
                ];
            }), // sản phẩm

        ]);
        dd($response->json());

        if ($response['code'] == 200) {
            return ServiceResource::collection($response['data']);
        };
        return $response->json();
    }
}
