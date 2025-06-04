<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    use CloudinaryTrait;


    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category' => [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
                'name' => $this->category->name,
                'image' => $this->buildImageUrl($this->category->image),
            ],
            'product_items' => $this->productItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'price' => $item->price,
                    'sale_price' => $item->sale_price,
                    'stock' => $item->stock,
                    'sku' => $item->sku,
                    'color' => [
                        'id' => $item->color->id,
                        'name' => $item->color->name,
                        'code' => $item->color->code,
                        'images' => $this->productImages->map(function ($img) {
                            return [
                                'id' => $img->id,
                                'url' => $this->buildImageUrl($img->url),
                            ];
                        }),
                    ],
                    'size' =>  [
                        'id' => $item->size->id,
                        'name' => $item->size->name,
                    ],
                    // 'images' => $item->productImages->map(function ($image) {
                    //     return [
                    //         'id' => $image->id,
                    //         'url' => $this->buildImageUrl($image->url),

                    //     ];
                    // })
                ];
            })

        ];
    }
}
