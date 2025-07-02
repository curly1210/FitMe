<?php

namespace App\Http\Resources\Admin;

use App\Traits\CloudinaryTrait;
use Cloudinary\Transformation\AbsolutePositionTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewReplyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    use CloudinaryTrait;
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "content" => $this->content,
            "review_id" => $this->review_id,
            "user" => [
                "id" => $this->user->id,
                "name" => $this->user->name,
                "avatar" => $this->buildImageUrl($this->user->avatar),
            ],
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
