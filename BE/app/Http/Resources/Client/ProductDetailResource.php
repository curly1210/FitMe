<?php
namespace App\Http\Resources\Client;


use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    use \App\Traits\CloudinaryTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $productItems = $this->productItems;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ],
            'product_items' => $productItems->map(function ($item) {
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
                        'images' => $item->images->map(function ($img) {
                            return [
                                'id' => $img->id,
                                'url' => $this->buildImageUrl($img->url),
                            ];
                        }),
                    ],
                    'size' => [
                        'id' => $item->size->id,
                        'name' => $item->size->name,
                    ],
                ];
            }),

           

            // Thêm comments
            'comments' => $this->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user' => [
                        'id' => $comment->user?->id,
                        'name' => $comment->user?->name,
                    ],
                    'is_active' => $comment->is_active,
                ];
            }),

            'related_products' => $this->getRelatedProducts(),
        ];
    }

    protected function getRelatedProducts()
    {
        $related = Product::where('category_id', $this->category_id)
            ->where('id', '!=', $this->id)
            ->take(4)
            ->get();

        return $related->map(function ($product) {
            $firstItem = $product->productItems->first();
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $firstItem?->price,
                'images' => $firstItem
                    ? $firstItem->images->take(2)->map(fn($img) => [
                        'url' => $this->buildImageUrl($img->url)
                    ])->values()
                    : [],
            ];
        });
    }



}
