<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliverytimeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "leadtime" => Carbon::createFromTimestamp($this["leadtime"], 'UTC') // Thời điểm dự kiến giao hàng
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
        ];
    }
}
