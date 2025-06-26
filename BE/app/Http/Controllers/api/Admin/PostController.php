<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use DOMDocument;

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
        // $request->validate([
        //     'title' => 'required|string|max:150',
        //     'content' => 'required',
        //     'thumbnail' => 'nullable|image',
        // ], [
        //     'title.required' => 'Tiêu đề tin tức là bắt buộc.',
        //     'title.string' => 'Tiêu đề tin tức là là chuỗi kí tự.',
        //     'title.max' => 'Tiêu đề tin tức tối đa 150 từ',
        //     'content.required' => 'Nội dung của tin tức là bắt buộc.',
        // ]);

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
        // $request->validate([
        //     'title' => 'required|string|max:150',
        //     'content' => 'required',
        //     'thumbnail' => 'nullable|image',
        // ]);

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
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tin tức đã xóa thành công'
        ]);
    }

    //Tải hình ảnh lên tử CKEditor (chỉ dành cho chỉnh sửa hình ảnh)
    public function uploadCkeditorImage(Request $request)
    {
        try {
            // $request->validate([
            //     'upload' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            // ]);

            //Lưu hình ảnh vào Cloudinary và tối ảnh content nhẹ nhất
            $uploadResult = $this->uploadImageToCloudinary($request->file('upload'), [
                'folder' => 'posts/content',
                'width' => 1200,
                'height' => null,
                'quality' => 80
            ]);

            return response()->json([
                'url' => $this->buildImageUrl($uploadResult['public_id'])
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => [
                    'message' => $e->errors()['upload'][0]
                ]
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'message' => 'Thất bại khi upload ảnh'
                ]
            ], 500);
        }
    }

    //Check ảnh của content từ phía HTML gửi về 
    protected function processContentImages($content, $oldContent = null)
    {
        if (!$content) {
            return $content;
        }


        $dom = new DOMDocument(); // tạo đối tượng để phân tích nội dụng HTML
        
        //Chuyển định dạng từ HTML sao cho chuẩn DOMDocument
        @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        //Tạo mảng để lưu ảnh từ content
        $images = $dom->getElementsByTagName('img');
        $cloudinaryUrls = [];


        //Kiểm tra hình ảnh lưu ở Cloudinary hay không
        foreach ($images as $img) {
            $src = $img->getAttribute('src');
            // Only track Cloudinary URLs
            if (filter_var($src, FILTER_VALIDATE_URL) && strpos($src, 'res.cloudinary.com') !== false) {
                $cloudinaryUrls[] = $src;
            }
        }

        // xóa những ảnh Cloudinary trong nội dung cũ mà không còn xuất hiện trong nội dung mới
        if ($oldContent) {
            $this->deleteContentImages($oldContent, $cloudinaryUrls);
        }

        return $dom->saveHTML();
    }

    
    protected function deleteContentImages($content, $keepUrls = [])
    {
        if (!$content) {
            return;
        }

        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $images = $dom->getElementsByTagName('img');
        // Tạo prefix URL của ảnh Cloudinary để đối chiếu
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $cloudinaryPrefix = "https://res.cloudinary.com/{$cloudName}/image/upload/";

        foreach ($images as $img) {
            $src = $img->getAttribute('src');
            if (strpos($src, $cloudinaryPrefix) === 0 && !in_array($src, $keepUrls)) {
                //Cắt bỏ phần đầu URL Cloudinary để lấy `public_id`
                $publicId = str_replace($cloudinaryPrefix, '', $src);
                $this->deleteImageFromCloudinary($publicId);
            }
        }
    }
}
