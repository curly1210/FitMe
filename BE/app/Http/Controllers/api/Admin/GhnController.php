<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

use App\Http\Resources\Client\WardResource;
use App\Http\Resources\Client\StoreResource;
use App\Http\Resources\Client\ServiceResource;
use App\Http\Resources\Client\DistrictResource;
use App\Http\Resources\Client\ProvinceResource;
use App\Http\Resources\Client\DeliverytimeResource;
use App\Http\Resources\Client\GhnOrderDetailResource;
use App\Models\ShippingOrder;

class GhnController extends Controller
{
    use ApiResponse;
    public function createOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Thông tin người gửi (shop)

            'from_name' => 'required|string|max:255',
            'from_phone' => 'required|string|max:20',
            'from_address' => 'required|string|max:255',
            'from_ward_name' => 'required|string|max:255',
            'from_district_name' => 'required|string|max:255',
            'from_province_name' => 'required|string|max:255',
            'from_district_id' => 'required|integer',
            'from_ward_code' => 'required|string|max:50',

            // Thông tin người nhận
            'to_name' => 'required|string|max:255',
            'to_phone' => 'required|string|max:10',
            'to_address' => 'required|string|max:255',
            'to_ward_code' => 'required|string|max:50',
            'to_district_id' => 'required|integer',

            // Thông tin đơn hàng
            "client_order_code" => "required|string|max:20",
            'total_amount' => 'required|numeric|min:0',

            "weight" => "required|numeric|min:0",
            "length" => "required|numeric|min:0",
            "width" => "required|numeric|min:0",
            "height" =>  "required|numeric|min:0",
            // Dịch vụ GHN
            'service_id' => 'required|integer',
            'service_type_id' => 'required|integer',

            // Items
            'items' => 'required|array|min:1',
            'items.*.name_product' => 'required|string|max:255',
            'items.*.sku' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sale_price' => 'required|numeric|min:0',
            'items.*.weight' => 'required|numeric|min:0',
            'items.*.category_name' => 'nullable|max:255',
        ], [
            'from_name.required' => 'Tên người gửi không được bỏ trống.',
            'from_phone.required' => 'Số điện thoại người gửi không được bỏ trống.',
            'from_address.required' => 'Địa chỉ người gửi không được bỏ trống.',
            'from_ward_name.required' => 'Phường/xã người gửi không được bỏ trống.',
            'from_district_name.required' => 'Quận/huyện người gửi không được bỏ trống.',
            'from_province_name.required' => 'Tỉnh/thành phố người gửi không được bỏ trống.',
            'from_district_id.required' => 'Quận/huyện trả hàng không được bỏ trống.',
            'from_district_id.integer' => 'Mã quận/huyện trả hàng phải là số.',
            'from_ward_code.required' => 'Phường/xã trả hàng không được bỏ trống.',
            'to_name.required' => 'Tên người nhận không được bỏ trống.',
            'to_phone.required' => 'Số điện thoại người nhận không được bỏ trống.',
            'to_address.required' => 'Địa chỉ người nhận không được bỏ trống.',
            'to_ward_code.required' => 'Phường/xã người nhận không được bỏ trống.',
            'to_district_id.required' => 'Quận/huyện người nhận không được bỏ trống.',
            'to_district_id.integer' => 'Mã quận/huyện người nhận phải là số.',

            'client_order_code.required' => 'Mã đơn hàng không được bỏ trống.',
            'total_amount.required' => 'Tổng tiền không được bỏ trống.',
            'total_amount.numeric' => 'Tổng tiền phải là số.',

            'weight.required' => 'Cân nặng kiện hàng không được bỏ trống.',
            'weight.numeric' => 'Cân nặng kiện hàng phải là số.',
            'weight.min' => 'Cân nặng kiện hàng phải lớn hơn hoặc bằng 0.',

            'items.required' => 'Đơn hàng phải có ít nhất 1 sản phẩm.',
            'items.array' => 'Danh sách sản phẩm không hợp lệ.',
            'items.*.name_product.required' => 'Tên sản phẩm không được bỏ trống.',
            'items.*.sku.required' => 'SKU sản phẩm không được bỏ trống.',
            'items.*.quantity.required' => 'Số lượng sản phẩm không được bỏ trống.',
            'items.*.quantity.integer' => 'Số lượng sản phẩm phải là số.',
            'items.*.quantity.min' => 'Số lượng sản phẩm ít nhất là 1.',
            'items.*.sale_price.required' => 'Giá bán sản phẩm không được bỏ trống.',
            'items.*.sale_price.numeric' => 'Giá bán sản phẩm phải là số.',
            'items.*.weight.required' => 'Trọng lượng sản phẩm là bắt buộc.',
            'items.*.weight.numberic' => 'Trọng lượng sản phẩm phải là kiểu số',
            'items.*.weight.min' => 'Trọng lượng sản phẩm phải là số không âm',
        ]);
        if ($validator->fails()) {
            return $this->error("Thiếu dữ liệu truyền vào", $validator->errors(), 422);
        }
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "ShopId" => env('GHN_SHOP_ID'),
            "Token" => env('GHN_TOKEN'),
        ])->post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
            [
                "payment_type_id" => 2, # 1 : người bán thanh toán phí vận chuyển  | 2: người mua thanh toán phí vận chuyển
                "note" => "Giao hàng đúng thời hạn", # Ghi chú cho shipper
                "required_note" => "KHONGCHOXEMHANG", # shipper đưa nguyên hộp, khách nhận rồi mới mở được.
                # Thông tin, địa chỉ shop hay người gủi
                "from_name" => $request->from_name,
                "from_phone" => $request->from_phone,
                "from_address" => $request->from_address,
                "from_ward_name" => $request->from_ward_name,
                "from_district_name" => $request->from_district_name,
                "from_province_name" =>  $request->from_province_name,
                # Thông tin, địa chỉ trả hàng khi giao thất bại 
                "return_phone" => $request->from_phone,
                "return_address" => $request->from_address,
                "return_district_id" => $request->from_district_id,
                "return_ward_code" => $request->from_ward_code,
                # Thông tin, địa chỉ người nhận
                "client_order_code" => $request->client_order_code,
                "to_name" => $request->to_name,
                "to_phone" => $request->to_phone,
                "to_address" => $request->to_address,
                "to_ward_code" => $request->to_ward_code,
                "to_district_id" => $request->to_district_id,
                "cod_amount" => $request->total_amount, // Tiền hàng 
                "content" => "Đơn hàng đặt từ hệ thống FITME",
                # Kích thước gói hàng của đơn hàng 
                "weight" => $request->weight,
                "length" =>  $request->length,
                "width" => $request->width,
                "height" =>  $request->height,
                // "pick_station_id" => 1444,
                "deliver_station_id" => null,
                "insurance_value" => $request->total_amount, # Tiền bồi thường khi hỏng hóc hoặc mất
                "service_id" => 53321,
                "service_type_id" => 2, // 2 : Hàng nhẹ ,  5 : hàng nặng
                "coupon" => null,
                "pick_shift" => [3], // lấy hàng vào ngày hôm sau
                #order_detail
                "items" => collect($request->items)->map(function ($item) {
                    return [
                        "name" => $item['name_product'],
                        "code" => $item['sku'],
                        "quantity" => $item['quantity'],
                        "price" => $item['sale_price'],
                        "weight" => $item['weight'],
                        "category" => $item['category_name'],
                    ];
                    // ---------------------
                    // "name" => "Áo Polo",
                    // "code" => "Polo123",
                    // "quantity" => 1,
                    // "price" => 200000,
                    // "length" => 12,
                    // "width" => 12,
                    // "height" => 12,
                    // "weight" => 1200,
                    // "category" => 'aos',
                }),
            ]
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
        return $this->error("Không có mã Quận/huyện", ["district_id" => "Không có dữ liệu"], 422);
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
    public function pickShift()
    {
        $response = Http::withHeaders([
            "token" => env('GHN_TOKEN'),
        ])->get("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shift/date");

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
                "length"          => "required|numeric",
                "width"           => "required|numeric",
                "height"          => "required|numeric",
                "weight"          => "required|numeric",
                "total_amount"    => "required|numeric|min:0",
                "items"           => "required|array|min:1",
                "items.*.name"    => "required|string",
                "items.*.quantity" => "required|integer|min:1",
                "items.*.weight" => "required|integer|min:1",

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
            "service_id" => 53321,
            "service_type_id" => 2, // 2 : Hàng nhẹ ,  5 : hàng nặng
            "from_ward_code" => $request->from_ward_code,
            "to_district_id" => $request->to_district_id,
            "to_ward_code" => $request->to_ward_code,
            "length" => $request->length,
            "width" => $request->width,
            "height" => $request->height,
            "weight" => $request->weight,
            "insurance_value" => $request->total_amount, #Phí đền bù khi đóng bảo hiểm
            "coupon" => null,
            "items" => collect($request->items)->map(function ($item) {
                return [
                    "name" => $item['name'],
                    "quantity" => $item['quantity'],
                    "weight" => $item['weight'],  //cân nặng sản phẩm
                ];
            }), // sản phẩm

        ]);

        return $response->json();
    }
    public function calculateExpectedDeliverytime(Request $request)
    {
        $validator = Validator::make($request->only(['from_district_id', "from_ward_code", "to_district_id", "to_ward_code", "service_id"]), [
            'from_district_id' => 'integer|required|min:0',
            'from_ward_code'   => 'required|string',
            'to_district_id'   => 'integer|required|min:0',
            'to_ward_code'     => 'required|string',
        ], [
            'from_district_id.required' => 'Vui lòng nhập quận/huyện lấy hàng.',
            'from_district_id.integer'  => 'Quận/huyện lấy hàng phải là số.',
            'from_district_id.min'      => 'Quận/huyện lấy hàng không được nhỏ hơn 0.',

            'from_ward_code.required'   => 'Vui lòng nhập phường/xã lấy hàng.',
            'from_ward_code.string'     => 'Phường/xã lấy hàng phải là chuỗi.',

            'to_district_id.required'   => 'Vui lòng nhập quận/huyện giao hàng.',
            'to_district_id.integer'    => 'Quận/huyện giao hàng phải là số.',
            'to_district_id.min'        => 'Quận/huyện giao hàng không được nhỏ hơn 0.',

            'to_ward_code.required'     => 'Vui lòng nhập phường/xã giao hàng.',
            'to_ward_code.string'       => 'Phường/xã giao hàng phải là chuỗi.',
        ]);
        if ($validator->fails()) {
            return $this->error("Dữ liệu truyền không hợp lệ", $validator->errors(), 422);
        }
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "ShopId" => env('GHN_SHOP_ID'),
            "token" => env('GHN_TOKEN'),
        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime", [
            "from_district_id" => $request->from_district_id,
            "from_ward_code" => $request->from_ward_code,
            "to_district_id" => $request->to_district_id,
            "to_ward_code" => $request->to_ward_code,
            "service_id" => 53321,
        ]);
        // dd($response->json());
        if ($response['code'] == 200) {

            return new DeliverytimeResource($response['data']);
        };
        return $response->json();
    }
    public function getOrderDetail($order_code)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail", [
            "order_code" => $order_code, // mã đơn hàng giao hàng nhanh
        ]);
        if ($response['code'] == 200) {

            return new GhnOrderDetailResource($response['data']);
        };
        return $response->json();
    }
    public function getOrderDetailByClientOrderCode(String $client_order_code)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail-by-client-code", [
            "client_order_code" => $client_order_code,
        ]);
        if ($response['code'] == 200) {

            return new GhnOrderDetailResource($response['data']);
        };
        return $response->json();
    }
    public function previewOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Thông tin người gửi (shop)

            'from_name' => 'required|string|max:255',
            'from_phone' => 'required|string|max:20',
            'from_address' => 'required|string|max:255',
            'from_ward_name' => 'required|string|max:255',
            'from_district_name' => 'required|string|max:255',
            'from_province_name' => 'required|string|max:255',
            'from_district_id' => 'required|integer',
            'from_ward_code' => 'required|string|max:50',

            // Thông tin người nhận
            'to_name' => 'required|string|max:255',
            'to_phone' => 'required|string|max:10',
            'to_address' => 'required|string|max:255',
            'to_ward_code' => 'required|string|max:50',
            'to_district_id' => 'required|integer',

            // Thông tin đơn hàng
            "client_order_code" => "required|string|max:20",
            'total_amount' => 'required|numeric|min:0',
            "weight" => "required|numeric|min:0",
            "length" => "required|numeric|min:0",
            "width" => "required|numeric|min:0",
            "height" =>  "required|numeric|min:0",
            // Dịch vụ GHN
            'coupon' => 'nullable|string|max:255',

            // Items
            'items' => 'required|array|min:1',
            'items.*.name_product' => 'required|string|max:255',
            'items.*.sku' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sale_price' => 'required|numeric|min:0',
            'items.*.weight' => 'nullable|numeric|min:0',
            'items.*.category_name' => 'nullable|max:255',
        ], [
            'from_name.required' => 'Tên người gửi không được bỏ trống.',
            'from_phone.required' => 'Số điện thoại người gửi không được bỏ trống.',
            'from_address.required' => 'Địa chỉ người gửi không được bỏ trống.',
            'from_ward_name.required' => 'Phường/xã người gửi không được bỏ trống.',
            'from_district_name.required' => 'Quận/huyện người gửi không được bỏ trống.',
            'from_province_name.required' => 'Tỉnh/thành phố người gửi không được bỏ trống.',
            'from_district_id.required' => 'Quận/huyện trả hàng không được bỏ trống.',
            'from_district_id.integer' => 'Mã quận/huyện trả hàng phải là số.',
            'from_ward_code.required' => 'Phường/xã trả hàng không được bỏ trống.',
            'to_name.required' => 'Tên người nhận không được bỏ trống.',
            'to_phone.required' => 'Số điện thoại người nhận không được bỏ trống.',
            'to_address.required' => 'Địa chỉ người nhận không được bỏ trống.',
            'to_ward_code.required' => 'Phường/xã người nhận không được bỏ trống.',
            'to_district_id.required' => 'Quận/huyện người nhận không được bỏ trống.',
            'to_district_id.integer' => 'Mã quận/huyện người nhận phải là số.',

            'client_order_code.required' => 'Mã đơn hàng không được bỏ trống.',
            'total_amount.required' => 'Tổng tiền không được bỏ trống.',
            'total_amount.numeric' => 'Tổng tiền phải là số.',

            'weight.required' => 'Cân nặng kiện hàng không được bỏ trống.',
            'weight.numeric' => 'Cân nặng kiện hàng phải là số.',
            'weight.min' => 'Cân nặng kiện hàng phải lớn hơn hoặc bằng 0.',

            'length.required' => 'Chiều dài kiện hàng không được bỏ trống.',
            'length.numeric' => 'Chiều dài kiện hàng phải là số.',
            'length.min' => 'Chiều dài kiện hàng phải lớn hơn hoặc bằng 0.',

            'width.required' => 'Chiều rộng kiện hàng không được bỏ trống.',
            'width.numeric' => 'Chiều rộng kiện hàng phải là số.',
            'width.min' => 'Chiều rộng kiện hàng phải lớn hơn hoặc bằng 0.',

            'height.required' => 'Chiều cao kiện hàng không được bỏ trống.',
            'height.numeric' => 'Chiều cao kiện hàng phải là số.',
            'height.min' => 'Chiều cao kiện hàng phải lớn hơn hoặc bằng 0.',

            'service_id.required' => 'Vui lòng chọn dịch vụ GHN.',
            'service_type_id.required' => 'Vui lòng chọn loại dịch vụ GHN.',

            'items.required' => 'Đơn hàng phải có ít nhất 1 sản phẩm.',
            'items.array' => 'Danh sách sản phẩm không hợp lệ.',
            'items.*.name_product.required' => 'Tên sản phẩm không được bỏ trống.',
            'items.*.sku.required' => 'SKU sản phẩm không được bỏ trống.',
            'items.*.quantity.required' => 'Số lượng sản phẩm không được bỏ trống.',
            'items.*.quantity.integer' => 'Số lượng sản phẩm phải là số.',
            'items.*.quantity.min' => 'Số lượng sản phẩm ít nhất là 1.',
            'items.*.sale_price.required' => 'Giá bán sản phẩm không được bỏ trống.',
            'items.*.sale_price.numeric' => 'Giá bán sản phẩm phải là số.',
        ]);
        if ($validator->fails()) {
            return $this->error("Thiếu dữ liệu truyền vào", $validator->errors(), 422);
        }
        $response = Http::withHeaders([
            "Content-Type" => "application/json",
            "ShopId" => env('GHN_SHOP_ID'),
            "Token" => env('GHN_TOKEN'),
        ])->post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview",
            [
                "payment_type_id" => 2, # 1 : người bán thanh toán phí vận chuyển  | 2: người mua thanh toán phí vận chuyển
                "note" => "Giao hàng đúng thời hạn", # Ghi chú cho shipper
                "required_note" => "KHONGCHOXEMHANG", # shipper đưa nguyên hộp, khách nhận rồi mới mở được.
                # Thông tin, địa chỉ shop hay người gủi
                "from_name" => $request->from_name,
                "from_phone" => $request->from_phone,
                "from_address" => $request->from_address,
                "from_ward_name" => $request->from_ward_name,
                "from_district_name" => $request->from_district_name,
                "from_province_name" =>  $request->from_province_name,
                # Thông tin, địa chỉ trả hàng khi giao thất bại 
                "return_phone" => $request->from_phone,
                "return_address" => $request->from_address,
                "return_district_id" => $request->from_district_id,
                "return_ward_code" => $request->from_ward_code,
                # Thông tin, địa chỉ người nhận
                "client_order_code" => $request->client_order_code,
                "to_name" => $request->to_name,
                "to_phone" => $request->to_phone,
                "to_address" => $request->to_address,
                "to_ward_code" => $request->to_ward_code,
                "to_district_id" => $request->to_district_id,
                "cod_amount" => $request->total_amount, // Tiền hàng + tiền ship
                "content" => "Đơn hàng đặt từ hệ thống FITME",
                # Kích thước gói hàng của đơn hàng 
                "weight" => $request->weight,
                "length" =>  $request->length,
                "width" => $request->width,
                "height" =>  $request->height,
                // "pick_station_id" => 1444,
                "deliver_station_id" => null,
                "insurance_value" => $request->total_amount, # Tiền bồi thường khi hỏng hóc hoặc mất
                "service_id" => 53321,
                "service_type_id" => 2, // 2 : Hàng nhẹ ,  5 : hàng nặng
                "coupon" => null,
                "pick_shift" => [3], // ca lấy hàng vào sáng ngày hôm sau
                #order_detail
                "items" => collect($request->items)->map(function ($item) {
                    return [
                        "name" => $item['name_product'],
                        "code" => $item['sku'],
                        "quantity" => $item['quantity'],
                        "price" => $item['sale_price'],
                        "weight" => $item['weight'],
                        "category" => $item['category_name'],
                    ];
                    // ---------------------
                    // "name" => "Áo Polo",
                    // "code" => "Polo123",
                    // "quantity" => 1,
                    // "price" => 200000,
                    // "length" => 12,
                    // "width" => 12,
                    // "height" => 12,
                    // "weight" => 1200,
                    // "category" => 'aos',
                }),
            ]
        );
        return response()->json($response->json());
    }
    public function cancelOrder(String $order_code)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
            "ShopId" => env("GHN_SHOP_ID"),

        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel", [
            "order_code" => $order_code,
        ]);
        return $response->json();
    }
    public function returnOrder(String $order_code)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
            "ShopId" => env("GHN_SHOP_ID"),

        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/return", [
            "order_code" => $order_code,
        ]);
        return $response->json();
    }
    public function storingOrder(String $order_code)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
            "ShopId" => env("GHN_SHOP_ID"),

        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/storing", [
            "order_code" => $order_code,
        ]);
        return $response->json();
    }
    public function printOrder(Request $request)
    {
        if (!$request->order_codes) {
            return $this->error("Truyền thiếu dữ liệu", ['order_codes' => "Không tồn tại order_codes"], 422);
        }
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            "token" => env('GHN_TOKEN'),
        ])->post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token", [
            "order_codes" =>  $request->order_codes,
        ]);
        return $response->json();
    }
    public function getWebhookStatus(Request $request)
    {
        // info
        Log::info('GHN Webhook Received:', $request->all());
        $statusShipping = $request->Status; // Create, Switch_status, v.v.
        $shippingCode = $request->ClientOrderCode;
        $type = $request->Type;
        // event
        $shippingOrder = ShippingOrder::where('shipping_code', $shippingCode)->first();
        $shippingOrder->update([
            'status_shipping' => $statusShipping
        ]);
        $shippingCode->reset();
        // payload
        $data = [
            'type' => $type,
            'status_shipping' => $statusShipping,
            'shipping_code' => $shippingCode,

        ];
        return response()->json(['message' => 'Received', 'data' => $data], 200);
    }
}
