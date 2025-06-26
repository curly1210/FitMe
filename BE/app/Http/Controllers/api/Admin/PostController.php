<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    //
    use CloudinaryTrait;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::all();
        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required',
            'thumbnail' => 'nullable|image',
            'img' => 'nullable|image',
        ], [
            'title.required' => 'Tiêu đề tin tức là bắt buộc.',
            'title.string' => 'Tiêu đề tin tức là là chuỗi kí tự.',
            'title.max' => 'Tiêu đề tin tức tối đa 150 từ',
            'content.required' => 'Nội dung của tin tức là bắt buộc.',
        ]);

        //Kiểm tra slug
        $slug = Str::slug($request->title);
        if (Post::where('slug', $slug)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Slug đã bị trùng, vui lòng dùng title khác',
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = $slug;

        if ($request->hasFile('thumbnail')) {
            $uploadResult = $this->uploadImageToCloudinary($request->file('thumbnail'), [
                'folder' => 'posts/thumbnails',
            ]);
            $data['thumbnail'] = $uploadResult['public_id'];
        }

        if ($request->hasFile('img')) {
            $uploadResult = $this->uploadImageToCloudinary($request->file('img'), [
                'folder' => 'posts/images',
            ]);
            $data['img'] = $uploadResult['public_id'];
        }

        $post = Post::create($data);
        return response()->json([
            'success' => true,
            'message' => 'Tạo mới tin tức thành công',
            'data' => new PostResource($post)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $post = Post::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new PostResource($post)
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required',
            'thumbnail' => 'nullable|image',
            'img' => 'nullable|image',
        ]);

        $post = Post::findOrFail($id);

        //Kiểm tra slug
        $slug = Str::slug($request->title);
        if (Post::where('slug', $slug)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Slug đã bị trùng, vui lòng dùng title khác',
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = $slug;

        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail) {
                $this->deleteImageFromCloudinary($post->thumbnail);
            }
            $uploadResult = $this->uploadImageToCloudinary($request->file('thumbnail'), [
                'folder' => 'posts/thumbnails',
            ]);
            $data['thumbnail'] = $uploadResult['public_id'];
        }

        if ($request->hasFile('img')) {
            if ($post->img) {
                $this->deleteImageFromCloudinary($post->img);
            }
            $uploadResult = $this->uploadImageToCloudinary($request->file('img'), [
                'folder' => 'posts/images',
            ]);
            $data['img'] = $uploadResult['public_id'];
        }

        $post->update($data);
        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã được cập nhật',
            'data' => new PostResource($post)
        ]);
    }

    public function delete($id)
    {
        $post = Post::findOrFail($id);

        if ($post->thumbnail) {
            $this->deleteImageFromCloudinary($post->thumbnail);
        }
        if ($post->img) {
            $this->deleteImageFromCloudinary($post->img);
        }
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã xóa thành công'
        ]);
    }

    //Tải hình ảnh lên tử CKEditor (chỉ dành cho chỉnh sửa hình ảnh)
    public function uploadImage(Request $request)
    {
        try {
            if ($request->hasFile('upload')) {
                $file = $request->file('upload');
                $uploadResult = $this->uploadImageToCloudinary($file, [
                    'folder' => 'posts/editor',
                ]);

                $imageUrl = $this->buildImageUrl($uploadResult['public_id']);
                return response()->json([
                    'url' => $imageUrl,
                ]);
            }

            return response()->json(['error' => 'Không có hình ảnh nào được tải lên'], 400);
        } catch (\Exception $e) {
            Log::error('Image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'Upload hình ảnh thất bại'], 500);
        }
    }
}
