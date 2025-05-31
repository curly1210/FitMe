<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\CloudinaryTrait;

class PostResource extends JsonResource
{
    use CloudinaryTrait;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'thumbnail' => $this->buildImageUrl($this->thumbnail),
            'img' => $this->buildImageUrl($this->img),
            'is_active' => (bool)$this->is_active,
            'created_at' => $this->created_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
            'updated_at' => $this->updated_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
        ];
    }
}
