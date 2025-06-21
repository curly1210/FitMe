<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\ProductImage;

class ProductResource extends JsonResource
{
    use CloudinaryTrait;


    public function toArray(Request $request)
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
            'colors' => $this->productItems
                ->where('is_active', 1)
                ->groupBy('color_id')
                ->map(function ($items) {
                    $item = $items->first();
                    return [
                        'id' => $item->color->id,
                        'name' => $item->color->name,
                        'code' => $item->color->code,
                        'min_sale_price' => $items->min('sale_price'),
                        'images' => ProductImage::query()
                            ->where('product_id', $item->product_id)
                            ->where('color_id', $item->color_id)
                            ->get()
                            ->map(function ($img) {
                                return [
                                    'id' => $img->id,
                                    'url' => $this->buildImageUrl($img->url),
                                ];
                            }),
                        'product_items' => $items->sortBy('sale_price')->values()->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'price' => $item->price,
                                'sale_price' => $item->sale_price,
                                'sale_percent' => $item->sale_percent,
                                'stock' => $item->stock,
                                'sku' => $item->sku,
                                'size' => [
                                    'id' => $item->size->id,
                                    'name' => $item->size->name,
                                ],
                            ];
                        })
                    ];
                })->sortBy('min_sale_price')->values(),
        ];
    }
}
