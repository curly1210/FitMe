<?php
namespace App\Http\Resources\Client;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
      public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'short_description' => $this->short_description,
            'description'       => $this->description,
            'slug'              => $this->slug,
            'category' => $this->category ? [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            'product_items' => $this->productItems->map(function ($item) {
                return [
                    'id'          => $item->id,
                    'import_price'=> $item->import_price,
                    'price'       => $item->price,
                    'sale_price'  => $item->sale_price,
                    'stock'       => $item->stock,
                    'sku'         => $item->sku,
                    'color'       => $item->color ? ['id' => $item->color->id, 'name' => $item->color->name, 'code' => $item->color->code] : null,
                    'size'        => $item->size ? ['id' => $item->size->id, 'name' => $item->size->name] : null,
                    'images'      => $item->images->map(function ($img) {
                        return [
                            'id'        => $img->id,
                            'url'       => $img->url,
                            'is_active' => $img->is_active,
                        ];
                    }),
                ];
            }),
            'related_products' => $this->whenLoaded('relatedProducts', function () {
                return $this->relatedProducts->map(function ($related) {
                    return [
                        'id'   => $related->id,
                        'name' => $related->name,
                        'slug' => $related->slug,
                    ];
                });
            }),
        ];
    }
}
