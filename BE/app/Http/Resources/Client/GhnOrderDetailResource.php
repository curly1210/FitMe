<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class GhnOrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
            [
                # Thông tin người nhận hàng hoàn
                "return_name" => $this['return_name'],
                "return_phone" => $this['return_phone'],
                "return_address" => $this['return_address'],
                "return_ward_code" => $this['return_ward_code'],
                "return_district_id" => $this['return_district_id'],
                # Thông tin người gửi (shop)
                "from_name" => $this['from_name'],
                "from_phone" => $this['from_phone'],
                "from_hotline" => $this['from_hotline'],
                "from_address" => $this['from_address'],
                "from_ward_code" => $this['from_ward_code'],
                "from_district_id" => $this['from_district_id'],
                # Mã bưu cục gần địa chỉ giao hàng (nếu chỉ định - auto)
                "deliver_station_id" => $this['deliver_station_id'],
                # Thông tin người nhận
                "to_name" => $this['to_name'], // Tên người nhận
                "to_address" => $this['to_address'], // Địa chỉ người nhận
                "to_ward_code" => $this['to_ward_code'],  // Mã phường/xã người nhận
                "to_district_id" => $this['to_district_id'], // ID quận/huyện người nhận
                # Thông tin kiện hàng sau khi đóng gói
                "weight" => $this['weight'],
                "length" => $this['length'],
                "width" => $this['width'],
                "height" => $this['height'],
                # Trọng lượng quy đổi & tính phí (Cân nặng nào lớn hơn sẽ được dùng để tích cước vận chuyển)
                "converted_weight" => $this['converted_weight'], // Cân nặng quy đổi (theo thể tích)
                "calculate_weight" => $this['calculate_weight'], // Cân nặng của kiện hàng thực tế
                # Dịch vụ giao hàng
                "service_type_id" => $this['service_type_id'], // Loại dịch vụ GHN [Hàng nặng , hàng nhẹ]
                "service_id" => $this['service_id'], // ID dịch vụ cụ thể
                # Phương thức thanh toán
                "payment_type_id" => $this['payment_type_id'], //Hình thức thanh toán chính (1: shop trả phí ship - freeship cho người dùng, 2: Người nhận trả phí ship)
                "payment_type_ids" => collect($this['payment_type_ids'])->map(function ($id) {
                    return $id;
                }), // Không quan trọng: phân người trả ship ['phí ship'=>1|2 (Shop trả | Người nhận trả) , 'Phí cod - giá trị đơn hàng'=>1|2 (Shop trả | Người nhận trả)]
                "custom_service_fee" => $this['custom_service_fee'], // Phí dịch vụ bổ sung - shop tự tính (nếu có)
                # Tiền thu hộ (COD)
                "cod_amount" => $this['cod_amount'],  // Số tiền COD thu hộ
                "cod_collect_date" => $this["cod_collect_date"]
                    ? Carbon::createFromTimestamp($this["cod_collect_date"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Ngày GHN thu tiền COD

                "cod_transfer_date" => $this["cod_transfer_date"]
                    ? Carbon::createFromTimestamp($this["cod_transfer_date"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Ngày GHN chuyển khoản COD cho shop

                "is_cod_transferred" => $this['is_cod_transferred'], // Đã chuyển COD chưa (true/false)
                "is_cod_collected" => $this['is_cod_collected'], // Đã thu COD chưa (true/false)
                "insurance_value" => $this['insurance_value'], // Giá trị đền bù khi mất hoặc hư hỏng hàng (dùng tính phí bảo hiểm)
                "order_value" => $this['order_value'], // Giá trị đơn hàng thực tế
                "pick_station_id" => $this['pick_station_id'], // ID Điểm bưu cục cụ thể GHN tới lấy hàng (trong trường hợp không lấy hàng ở shop)
                "cod_failed_amount" => $this['cod_failed_amount'], // Số tiền COD thu hộ thất bại (nếu khách không trả)
                "cod_failed_collect_date" => $this["cod_failed_collect_date"]
                    ? Carbon::createFromTimestamp($this["cod_failed_collect_date"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Ngày thu tiền thất bại

                # Thời gian xử lý đơn
                "pickup_time" => $this["pickup_time"]
                    ? Carbon::createFromTimestamp($this["pickup_time"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Thời gian GHN đã lấy hàng

                "request_delivery_time" => $this["request_delivery_time"]
                    ? Carbon::createFromTimestamp($this["request_delivery_time"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Thời gian GHN bắt đầu giao hàng
                # Danh sách sản phẩm trong đơn
                "items" => collect($this['items'])->map(function ($item) {
                    return $item;
                }),
                # Mã đơn hàng (của GHN)
                "order_code" => $this['order_code'],
                # Các kho liên quan
                "pick_warehouse_id" => $this['pick_warehouse_id'], // ID Kho lấy hàng GHN
                "deliver_warehouse_id" => $this['deliver_warehouse_id'],  // ID Kho giao hàng GHN
                "current_warehouse_id" => $this['current_warehouse_id'],  // ID Kho hiện tại
                "return_warehouse_id" => $this['return_warehouse_id'], // ID Kho hàng hoàn

                "next_warehouse_id" => $this['next_warehouse_id'], // ID Kho kế tiếp
                "current_transport_warehouse_id" => $this['current_transport_warehouse_id'], // ID Kho trung chuyển hiện tại
                "leadtime" => $this["leadtime"]
                    ? Carbon::createFromTimestamp($this["leadtime"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null,  // Thời gian GHN dự kiến hoàn thành đơn

                "leadtime_order" => [
                    "from_estimate_date" => Carbon::parse($this["leadtime_order"]["from_estimate_date"], 'UTC') //Thời gian dự kiến bắt đầu giao
                        ->setTimezone('Asia/Ho_Chi_Minh')
                        ->toDateTimeString(),  // Thời gian dự kiến GHN bắt đầu giao hàng   

                    "to_estimate_date" => Carbon::parse($this["leadtime_order"]["to_estimate_date"], 'UTC') //Thời gian dự kiến giao trễ nhất 
                        ->setTimezone('Asia/Ho_Chi_Minh')
                        ->toDateTimeString(), // Thời gian dự kiến GHN giao hàng muộn nhất
                ],
                "order_date" => $this["order_date"]
                    ? Carbon::createFromTimestamp($this["order_date"], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Ngày tạo đơn

                "tag" => $this['tag'], // Tag đơn hàng (VD: hàng dễ vỡ, quà tặng...)
                "finish_date" => $this['finish_date']
                    ? Carbon::createFromTimestamp($this['finish_date'], 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                    : null, // Ngày đơn hoàn tất (đã giao xong)
                // Các flag đặc biệt
                "is_partial_return" => $this['is_partial_return'], // true: hoàn 1 phần hàng; false: hoàn toàn bộ hàng
                "is_document_return" => $this['is_document_return'], // true: hàng hoàn là giấy tờ; false: hàng hoàn là hàng hóa
                "pick_shift" => $this['pick_shift'], // Ca GHN sẽ tới shop hoặc kho để lấy hàng (sáng, chiều... lấy trong api pick ship)
                "pickup_shift" => collect($this['pickup_shift'])->map(function ($item) {
                    return
                        $item
                        ? Carbon::createFromTimestamp($item, 'UTC')->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
                        : null;
                }), // Danh sách các mốc thời gian ca lấy hàng
                "transportation_status" => $this['transportation_status'], // Trạng thái vận chuyển
                "transportation_phase" => $this['transportation_phase'], // Giai đoạn vận chuyển (đang giao, đã giao, hoàn hàng...)
                "client_order_code" => $this['client_order_code'],
            ];
    }
}
