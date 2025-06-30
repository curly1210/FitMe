<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\Client\PostResource;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('is_active', 1)->latest()->get();

        return PostResource::collection($posts);
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);

        return new PostResource($post);
    }
}
