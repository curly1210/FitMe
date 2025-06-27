<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use App\Traits\ApiResponse;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use DOMDocument;

class PostController extends Controller
{
    use ApiResponse, CloudinaryTrait;

    public function index()
    {
        $posts = Post::all();
        return $this->success(PostResource::collection($posts));
    }

    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:150|unique:posts',
                'content' => 'required|string',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'is_active' => 'boolean',
            ]);

            $data = $validated;
            $data['slug'] = Str::slug($request->title);

            // $data['content'] = $this->processContentImages($request->input('content'));

            if ($request->hasFile('thumbnail')) {
                $uploadResult = $this->uploadImageToCloudinary($request->file('thumbnail'), [
                    'folder' => 'posts',
                    'width' => 800,
                    'height' => 600,
                    'quality' => 80
                ]);
                $data['thumbnail'] = $uploadResult['public_id'];
            }

            $post = Post::create($data);
            return $this->success(new PostResource($post), 'Tạo mới bài viết thành công', 201);
        } catch (ValidationException $e) {
            return $this->error('Validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->error('Failed to create post', [$e->getMessage()], 500);
        }
    }

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
        try {
            $post = Post::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:150|unique:posts,title,' . $post->id,
                'content' => 'required|string',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'is_active' => 'boolean',
            ]);


            $data = $validated;
            $data['slug'] = Str::slug($request->title);

            // $data['content'] = $this->processContentImages($request->input('content'), $post->content);

            if ($request->hasFile('thumbnail')) {
                if ($post->thumbnail) {
                    $this->deleteImageFromCloudinary($post->thumbnail);
                }
                
                $uploadResult = $this->uploadImageToCloudinary($request->file('thumbnail'), [
                    'folder' => 'posts',
                    'width' => 800,
                    'height' => 600,
                    'quality' => 80
                ]);
                $data['thumbnail'] = $uploadResult['public_id'];
            }

            $post->update($data);
            return $this->success(new PostResource($post), 'Bài viết đã được cập nhật');
        } catch (ValidationException $e) {
            return $this->error('Validation thất bại', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->error('Cập nhật bài viết thất bại', [$e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {
        try {
            $post = Post::findOrFail($id);
            
            if ($post->thumbnail) {
                $this->deleteImageFromCloudinary($post->thumbnail);
            }

            $this->deleteContentImages($post->content);

            $post->delete();
            return $this->success(null, 'Bài viết đã được xóa');
        } catch (\Exception $e) {
            return $this->error('Có lỗi khi xóa', [$e->getMessage()], 500);
        }
    }

    //Upload ảnh bên content
    public function uploadCkeditorImage(Request $request)
    {
        try {
            // $request->validate([
            //     'upload' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            // ]);

            $uploadResult = $this->uploadImageToCloudinary($request->file('upload'), [
                'folder' => 'posts/content',
                'width' => 1200,
                'height' => null,
                'quality' => 80
            ]);

            return response()->json([
                'url' => $this->buildImageUrl($uploadResult['public_id'])
            ]);
        } 
        // catch (ValidationException $e) {
        //     return response()->json([
        //         'error' => [
        //             'message' => $e->errors()['upload'][0]
        //         ]
        //     ], 422);
        // }
         catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'message' => 'Upload ảnh thất bại'
                ]
            ], 500);
        }
    }

    //Check ảnh bên content
    // protected function processContentImages($content, $oldContent = null)
    // {
    //     if (!$content) {
    //         return $content;
    //     }

    //     $dom = new DOMDocument();
    //     @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

    //     $images = $dom->getElementsByTagName('img');
    //     $cloudinaryUrls = [];

    //     foreach ($images as $img) {
    //         $src = $img->getAttribute('src');
    //         if (filter_var($src, FILTER_VALIDATE_URL) && strpos($src, 'res.cloudinary.com') !== false) {
    //             $cloudinaryUrls[] = $src;
    //         }
    //     }

    //     if ($oldContent) {
    //         $this->deleteContentImages($oldContent, $cloudinaryUrls);
    //     }

    //     return $dom->saveHTML();
    // }


    protected function deleteContentImages($content, $keepUrls = [])
    {
        if (!$content) {
            return;
        }

        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $images = $dom->getElementsByTagName('img');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $cloudinaryPrefix = "https://res.cloudinary.com/{$cloudName}/image/upload/";

        foreach ($images as $img) {
            $src = $img->getAttribute('src');
            if (strpos($src, $cloudinaryPrefix) === 0 && !in_array($src, $keepUrls)) {
                $publicId = str_replace($cloudinaryPrefix, '', $src);
                $this->deleteImageFromCloudinary($publicId);
            }
        }
    }
}