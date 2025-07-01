<?php

namespace App\Http\Resources\Client;

use App\Models\ReviewReply;
use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
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
        $replies = ReviewReply::query()->where('review_id', $this->id)->get();
        return [
            'id' => $this->id,
            "replies" => $replies->map(function ($reply) {
                return [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'user' => [
                        'name' => $reply->user->name,
                        'avatar' => $this->buildImageUrl($reply->user->avatar),
                    ],
                    'created_at' => $reply->created_at,
                    'updated_at' => $reply->created_at
                ];
            }),
            "rate" => $this->rate,
            "content" => $this->content,
            "is_active" => $this->is_active,
            "is_update" => $this->is_update,
            "productItem" => [
                "id" => $this->productItem->id,
                "name" => $this->productItem->product->name,
                "price" => $this->productItem->price,
                "sale_price" => $this->productItem->sale_price,
                "sale_percent" => $this->productItem->sale_percent,
                "product_image" => $this->productItem->color->productImages->first()->url,
                "size" => optional($this->productItem->size)->name ?? null,
                "color" =>  optional($this->productItem->color)->name ?? null,


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
