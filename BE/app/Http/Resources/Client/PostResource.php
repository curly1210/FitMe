<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\CloudinaryTrait;
use App\Models\Post;
use Illuminate\Support\Str;


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
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
            'updated_at' => $this->updated_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
            'related_posts' => $this->getRelatedPosts(),
        ];
    }
    protected function getRelatedPosts()
    {
        // Lấy các bài post liên quan
        $related = Post::where('is_active', 1)
            ->where('id', '!=', $this->id)
            // ->where('title', 'like', '%' . Str::limit($this->title, 0, 10) . '%')
            ->latest()
            ->take(5)
            ->get();


        return $related->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'thumbnail' => $this->buildImageUrl($post->thumbnail),
                'created_at' => $post->created_at?->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
            ];
        });
    }
}
