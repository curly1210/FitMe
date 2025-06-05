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

        $colorImages = [];

        foreach ($this->productImages as $image) {
            $colorId = $image->color_id;

            if (!isset($colorImages[$colorId])) {
                $item = $this->productItems->firstWhere('color_id', $colorId);
                $color = $item?->color;

                if (!$color)
                    continue;

                $colorImages[$colorId] = [
                    'id' => $color->id,
                    'name' => $color->name,
                    'code' => $color->code,
                    'images' => [],
                ];
            }

            $colorImages[$colorId]['images'][] = [
                'id' => $image->id,
                'url' => $this->buildImageUrl($image->url),
            ];
        }
        $sizes = $productItems
            ->pluck('size')
            ->unique('id')
            ->sortBy('id')
            ->values()
            ->map(function ($size) {
                return [
                    'id' => $size->id,
                    'name' => $size->name,
                ];
            });


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
                    'import_price' => $item->import_price,
                    'price' => $item->price,
                    'sale_price' => $item->sale_price,
                    'stock' => $item->stock,
                    'sku' => $item->sku,
                    'color_id' => $item->color->id,


                    'size' => [
                        'id' => $item->size->id,
                        'name' => $item->size->name,
                    ],

                ];
            }),
            'sizes' => $sizes,
            'color_images' => array_values($colorImages),
            'comments' => $this->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user' => [
                        'id' => $comment->user?->id,
                        'name' => $comment->user?->name,
                    ],
                    'is_active' => $comment->is_active,
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),

                ];
            }),
            'related_products' => $this->getRelatedProducts(),
        ];
    }

    protected function getRelatedProducts()
    {
        $related = Product::where('id', '!=', $this->id)
            ->where('category_id', $this->category_id) // lọc theo cùng category
            ->take(4)
            ->get();

        return $related->map(function ($product) {
            $firstItem = $product->productItems->first();

            return [
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $firstItem?->price,
                'images' => $firstItem
                    ? $product->productImages
                        ->where('color_id', $firstItem->color_id)
                        ->take(2)
                        ->map(fn($img) => [
                            'url' => $this->buildImageUrl($img->url),
                        ])->values()
                    : [],
            ];
        });
    }




}
