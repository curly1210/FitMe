<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\Client\PostResource;
use Illuminate\Support\Facades\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('is_active', 1)->latest()->get();

        return PostResource::collection($posts);
    }

    public function show(Request $request, $slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        return new PostResource($post);
    }
}
