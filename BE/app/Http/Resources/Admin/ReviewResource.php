<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Resources\Json\JsonResource;
use Ramsey\Uuid\Type\Decimal;

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
            'name' => $this->name,
            'product_images' => $this->productImages ? $this->buildImageUrl($this->productImages->first()->url) : null,
            'category' => $this->category->name,
            'reviews_count' => $this->reviews_count,
            'reviews_avg_rate' => $this->reviews_avg_rate ? round($this->reviews_avg_rate) : null,
        ];
    }
}
