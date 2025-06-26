<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    use CloudinaryTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            "rate" => $this->rate,
            "content" => $this->content,
            "is_active" => $this->is_active,
            "productItem" => [
                "id" => $this->productItem->id,
                "name" => $this->productItem->product->name,
                "price" => $this->productItem->price,
                "sale_price" => $this->productItem->sale_price,
                "sale_percent" => $this->productItem->sale_percent,
                "size" => optional($this->productItem->size)->name ?? null,
                "product_image" => $this->productItem->color->productImages->first()->url,
                "color" => [
                    "id" => $this->productItem->color->id,
                    "name" => $this->productItem->color->name,
                    "code" => $this->productItem->color->code,
                ],

            ],

            "review_images" => $this->reviewImages->map(function ($image) {
                return [
                    "id" => $image->id,
                    "url" => $this->buildImageUrl($image->url),
                ];
            }),

            "user" => [
                "id" => $this->user->id,
                "name" => $this->user->name,
                "avatar" => $this->buildImageUrl($this->user->avatar),
            ],
            "created_at" => $this->created_at->format('Y-m-d H:i:s'),
            "updated_at" => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
