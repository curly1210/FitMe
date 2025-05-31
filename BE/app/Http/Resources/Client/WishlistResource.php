<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WishlistResource extends JsonResource
{
    use CloudinaryTrait;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'short_description' => $this->product->short_description,
                'category' => [
                    'id' => $this->product->category->id,
                    'name' => $this->product->category->name,
                    'image' => $this->buildImageUrl($this->product->category->image),
                ],
                'product_items' => $this->whenLoaded('productItems', function () {
                    return $this->product->productItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'price' => $item->price,
                            'sale_price' => $item->sale_price,
                            'stock' => $item->stock,
                            'sku' => $item->sku,
                            'is_active' => $item->is_active,
                            'color' => $item->color ? [
                                'id' => $item->color->id,
                                'name' => $item->color->name,
                            ] : null,
                            'size' => $item->size ? [
                                'id' => $item->size->id,
                                'name' => $item->size->name,
                            ] : null,
                            'images' => $item->productImages->map(function ($image) {
                                return [
                                    'id' => $image->id,
                                    'url' => $this->buildImageUrl($image->url),
                                    'is_active' => $image->is_active,
                                ];
                            })->toArray(),
                        ];
                    })->toArray();
                }),
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}