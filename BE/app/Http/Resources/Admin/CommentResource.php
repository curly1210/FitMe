<?php

namespace App\Http\Resources\Admin;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'description' => $this->description,
            'price' => round($this->productItems->avg('price')), // lấy ra giá trung bình của sản phẩm
            'total_inventory' => $this->total_inventory, 
            'image' => optional($this->productImages->first())->url ?? null, 
            'is_active' => $this->is_active,
            'comments' => $this->whenLoaded('comments', fn() => $this->comments->map(fn($comment) => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toDateTimeString(),
                'user' => [
                    'id' => $comment->user_id,
                    'name' => $comment->user->name ?? 'Unknown', 
                ],
            ])),
        ];
    }
}
