<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TopSellingProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $productItem = $this->topProducts;

        if (!$productItem || !$productItem->product) {
            return [$productItem]; // hoặc return [] nếu bạn muốn ẩn nó khỏi danh sách
        }

        return [
            'id' => $productItem->id,
            'name' => $productItem->product->name,
            'slug' => $productItem->product->slug,
            'sale_price' => $productItem->sale_price,
            'stock' => $productItem->stock,
            'total_quantity_sold' => (int) $this->total_quantity,
            'total_revenue' => (int) $this->total_revenue,
        ];
    }
}
