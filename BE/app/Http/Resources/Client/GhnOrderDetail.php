<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class GhnOrderDetail extends JsonResource
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
                "return_name" => $this['return_name'],
                "return_phone" => $this['return_phone'],
                "return_address" => $this['return_address'],
                "return_ward_code" => $this['return_ward_code'],
                "return_district_id" => $this['return_district_id'],
                "from_name" => $this['from_name'],
                "from_phone" => $this['from_phone'],
                "from_hotline" => $this['from_hotline'],
                "from_address" => $this['from_address'],
                "from_ward_code" => $this['from_ward_code'],
                "from_district_id" => $this['from_district_id'],
                "deliver_station_id" => $this['deliver_station_id'],
                "to_name" => $this['to_name'],
                "to_address" => $this['to_address'],
                "to_ward_code" => $this['to_ward_code'],
                "to_district_id" => $this['to_district_id'],
                "weight" => $this['weight'],
                "length" => $this['length'],
                "width" => $this['width'],
                "height" => $this['height'],
                "converted_weight" => $this['converted_weight'],
                "calculate_weight" => $this['calculate_weight'],
                "service_type_id" => $this['service_type_id'],
                "service_id" => $this['service_id'],
                "payment_type_id" => $this['payment_type_id'],
                "payment_type_ids" => collect($this['payment_type_ids'])->map(function ($id) {
                    return [$id];
                }),
                "custom_service_fee" => $this['custom_service_fee'],
                "cod_amount" => $this['cod_amount'],
                "cod_collect_date" => Carbon::createFromTimestamp($this["cod_collect_date"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "cod_transfer_date" => Carbon::createFromTimestamp($this["cod_transfer_date"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "is_cod_transferred" => $this['is_cod_transferred'],
                "is_cod_collected" => $this['is_cod_collected'],
                "insurance_value" => $this['insurance_value'],
                "order_value" => $this['order_value'],
                "pick_station_id" => $this['pick_station_id'],
                "cod_failed_amount" => $this['cod_failed_amount'],
                "cod_failed_collect_date" => Carbon::createFromTimestamp($this["cod_failed_collect_date"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "pickup_time" =>    Carbon::createFromTimestamp($this["pickup_time"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "request_delivery_time" => Carbon::createFromTimestamp($this["request_delivery_time"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "items" => collect($this['items'])->map(function ($item) {
                    return $item;
                }),
                "order_code" => $this['order_code'],

                "pick_warehouse_id" => $this['pick_warehouse_id'],
                "deliver_warehouse_id" => $this['deliver_warehouse_id'],
                "current_warehouse_id" => $this['current_warehouse_id'],
                "return_warehouse_id" => $this['return_warehouse_id'],

                "next_warehouse_id" => $this['next_warehouse_id'],
                "current_transport_warehouse_id" => $this['current_transport_warehouse_id'],
                "leadtime" => Carbon::createFromTimestamp($this["leadtime"], 'UTC')
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),

                "leadtime_order" => [
                    "from_estimate_date" => Carbon::parse($this["leadtime_order"]["from_estimate_date"], 'UTC') //Thời gian dự kiến bắt đầu giao
                        ->setTimezone('Asia/Ho_Chi_Minh')
                        ->toDateTimeString(),

                    "to_estimate_date" => Carbon::parse($this["leadtime_order"]["to_estimate_date"], 'UTC') //Thời gian dự kiến giao trễ nhất 
                        ->setTimezone('Asia/Ho_Chi_Minh')
                        ->toDateTimeString(),
                ],
                "order_date" => Carbon::createFromTimestamp($this["order_date"], 'UTC') // Thời điểm dự kiến giao hàng
                    ->setTimezone('Asia/Ho_Chi_Minh')
                    ->toDateTimeString(),
                "current_transport_warehouse_id" => $this['current_transport_warehouse_id'],
                "current_transport_warehouse_id" => $this['current_transport_warehouse_id'],
                "current_transport_warehouse_id" => $this['current_transport_warehouse_id'],






            ];
    }
}
