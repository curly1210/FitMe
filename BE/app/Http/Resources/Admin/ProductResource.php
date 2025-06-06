<?php

namespace App\Http\Resources\Admin;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    use CloudinaryTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'is_active' => (bool) $this->is_active,
            'total_inventory' => $this->total_inventory,
            'product_items' => $this->productItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'sku' => $item->sku,
                    'price' => $item->price,
                    'sale_percent' => $item->sale_price,
                    'import_price' => $item->import_price,
                    'price' => $item->price,
                    'stock' => $item->stock,
                    'is_active' => (bool) $item->is_active,
                    'color' => $item->color ? [
                        'id' => $item->color->id,
                        'name' => $item->color->name,
                    ] : null,
                    'size' => $item->size ? [
                        'id' => $item->size->id,
                        'name' => $item->size->name,
                    ] : null,
                ];
            }),
            'images' => $this->productImages->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $this->buildImageUrl($image->url),
                    'is_active' => (bool) $image->is_active,
                    'colorId' => $image->color->id,
                    'color' => $image->color ? [
                        'id' => $image->color->id,
                        'name' => $image->color->name,
                    ] : null,
                ];
            }),
        ];
    }
}
