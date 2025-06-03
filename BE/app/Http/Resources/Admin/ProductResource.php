<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request) 
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category ? $this->category->name : null,
            'image' => $this->productItems->first() && $this->productItems->first()->productImages->first() 
                ? $this->productItems->first()->productImages->first()->url 
                : null,
            'total_inventory' => $this->productItems->sum('stock'),
            'is_active' => $this->is_active,
        ];
    }
}
