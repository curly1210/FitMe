<?php
namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OverviewStatisticResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_orders' => $this['total_orders'],
            'total_selling_products' => $this['total_selling_products'],
            'total_customers' => $this['total_customers'],
            'orders_by_status' => collect(range(1, 7))->mapWithKeys(function ($status) {
                return [$status => $this['orders_by_status'][$status] ?? 0];
            }),
        ];
    }
}
