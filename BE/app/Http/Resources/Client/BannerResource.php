<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\CloudinaryTrait;

class BannerResource extends JsonResource
{
    use CloudinaryTrait;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'direct_link' => $this->direct_link,
            'url_image' => $this->buildImageUrl($this->url_image),
            'content' => $this->content,
            'created_at' => $this->created_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
            'updated_at' => $this->updated_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
        ];
    }
}
