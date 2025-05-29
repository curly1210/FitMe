<?php

namespace App\Http\Resources\Admin;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    protected $childCategories;
    protected $parentCategories;

    protected $products;
    protected $posts;

    public function __construct($resource, $parentCategories, $childCategories, $products, $posts)
    {
        parent::__construct($resource);
        $this->childCategories = $childCategories;
        $this->parentCategories = $parentCategories;
        $this->products = $products;
        $this->posts = $posts;
    }
    public function toArray(Request $request): array
    {
        return [

            "banner" => [
                'id' => $this->id,
                'title' => $this->title,
                'direct_link' => $this->direct_link,
                'url_image' => $this->url_image,
            ],
            'categories' => $this->parentCategories->map(function ($parent) {
                $children = $this->childCategories->where('parent_id', $parent->id)->values();

                return [
                    'id' => $parent->id,
                    'name' => $parent->name,
                    'parent_id' => $parent->parent_id,
                    'slug' => Str::slug($parent->name),
                    'items' => $children->map(function ($item) {

                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'slug' => Str::slug($item->name),
                        ];
                    }),
                ];
            }),
            "products" => $this->products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                ];
            }),

            "posts" => $this->posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => Str::slug($post->title),
                ];
            }),


        ];
    }
}
