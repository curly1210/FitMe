<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Admin\ProductItemBasicResource;
use App\Http\Resources\Admin\TopSellingProductResource;

class ProductStatisticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'top_selling_products' => collect($this['top_selling_products'])->map(function ($item) {
                $productItem = $item->productItem;
                $product = $productItem?->product;
                return [
                    'product_item_id' => $item->product_item_id,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_revenue' => (int) $item->total_revenue,
                    'product_item' => $item->productItem ? [
                        'sku' => $item->productItem->sku,
                        'stock' => $item->productItem->stock,
                        'price' => $item->productItem->price,
                        'sale_price' => $item->productItem->sale_price,
                        'sale_percent' => $item->productItem->sale_percent,
                        'color' => $item->productItem->color->code,
                        'size' => $item->productItem->size->name,
                        'thumbnail' => $product?->images->first()?->url,
                        'product' => $item->productItem->product ? [
                            'id' => $item->productItem->product->id,
                            'name' => $item->productItem->product->name,
                            'slug' => $item->productItem->product->slug,
                        ] : null,
                    ] : null,
                ];
            }),

            'stock' => [
                'low' => collect($this['stock']['low'])->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'sku' => $item->sku,
                        'stock' => $item->stock,
                        'price' => $item->price,
                        'sale_price' => $item->sale_price,
                        'is_active' => $item->is_active,
                        'color' => $item->color?->code,
                        'size' => $item->size?->name,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'total_inventory' => $item->product->total_inventory,
                        ] : null,
                        'thumbnail' => $item->imageByColor?->url,
                    ];
                }),
                'high' => collect($this['stock']['high'])->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'sku' => $item->sku,
                        'stock' => $item->stock,
                        'price' => $item->price,
                        'sale_price' => $item->sale_price,
                        'is_active' => $item->is_active,
                        'color' => $item->color?->code,
                        'size' => $item->size?->name,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'total_inventory' => $item->product->total_inventory,
                        ] : null,
                        'thumbnail' => $item->imageByColor?->url,
                    ];
                }),
            ],

            // 'classification' => [
            //     'by_category' => collect($this['classification']['by_category'])->map(function ($item) {
            //         return [
            //             'category_id' => $item->category_id,
            //             'name' => optional($item->category)->name,
            //             'total' => (int) $item->total,
            //         ];
            //     }),
            //     'by_color' => collect($this['classification']['by_color'])->map(function ($item) {
            //         return [
            //             'color_id' => $item->color_id,
            //             'name' => optional($item->color)->name,
            //             'total' => (int) $item->total,
            //         ];
            //     }),
            //     'by_size' => collect($this['classification']['by_size'])->map(function ($item) {
            //         return [
            //             'size_id' => $item->size_id,
            //             'name' => optional($item->size)->name,
            //             'total' => (int) $item->total,
            //         ];
            //     }),
            // ],
        ];
    }
}
