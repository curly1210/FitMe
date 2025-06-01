<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Post;
use App\Models\Banner;
use App\Models\Product;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Admin\BannerResource;
use App\Http\Resources\Admin\CategoryResource;

class BannerController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index()
    {
        $banners = Banner::query()->get(['id', 'title', 'url_image', 'direct_link']);
        if ($banners->isEmpty()) {
            return $this->success([], "không có banner", 200);
        } else {

            return response()->json(
                $banners->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->title,
                        'direct_link' => $banner->direct_link,
                        'url_image' => $this->buildImageUrl($banner->url_image),
                    ];
                }),
                200
            );
        }
    }
    public function show($id)
    {
        $banner = Banner::find($id);

        if ($banner) {
            $directLink = $banner->direct_link;
            $directElements = array_values(array_filter(explode('/', $directLink)));
            $directType = $directElements[0];
            $directValue = $directElements[1];
            # Trường hợp có danh mục con
            if ($directType == "danh-muc") {
                $subDirectValue = $directElements[1]; # trường hợp có danh mục con

                // dd($subDirectValue);
                $parentId = Category::query()->where('slug', $subDirectValue)->value('parent_id');


                if ($parentId == null) {
                    $parentId = Category::query()->where('slug', 'LIKE', $directValue)->value('parent_id');
                    $subDirectValue = null;
                } else {
                    $slugParent = Category::query()->where('id', $parentId)->value('slug');
                    $directValue = $slugParent;
                }
            } else {
                $subDirectValue = null; # trường hợp không có danh mục con
            }
            return response()->json([
                'id' => $banner->id,
                'title' => $banner->title,
                'direct_link' => $directLink,
                'direct_type' => $directType,
                'direct_value' => $directValue,
                'sub_direct_value' =>  $subDirectValue,
                'url_image' => $this->buildImageUrl($banner->url_image),
                "updated_at" => $banner->updated_at
            ], 200);
        } else {
            return $this->error('Không tìm thấy banner', 404);
        }
    }
    public function getCategories()
    {

        $parentCategories = Category::query()->whereNull('parent_id')->get();
        $childCategories = Category::query()->whereNotNull('parent_id')->get();
        if ($parentCategories->isEmpty()) {
            return $this->success([], "Không có danh mục");
        } else {
            return new CategoryResource($parentCategories, $childCategories);
        }
    }
    public function getPosts()
    {
        $posts = Post::query()->where('is_active', "=", 1)->orderBy('created_at', 'desc')->get(['id', 'title', 'is_active'])->take(10);
        if ($posts->isEmpty()) {
            return $this->success([], "Không có bài viết");
        } else {
            return response()->json(
                $posts->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'slug' => Str::slug($post->title),
                    ];
                }),
                200
            );
        }
    }
    public function getProducts()
    {
        $products = Product::query()->where('is_active', "=", 1)->orderBy('created_at', 'desc')->get(['id', 'name', 'slug', 'category_id', 'is_active'])->take(30);
        if ($products->isEmpty()) {
            return $this->success([], "Không có sản phẩm");
        } else {
            return response()->json(
                $products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                    ];
                }),
                200
            );
        }
    }
    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return $this->error('Không tìm thấy banner', 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|max:50',
            'direct_type' => 'required', # danh-muc, san-pham, bai-viet
            'direct_value' => 'required', # sản phẩm ao-thun-ong-rong,Bài viết "bai-viet-ra-mat-san-pham", danh mục 'ao-khoac-nam'
            'sub_direct_value' => 'nullable', #  Trường hợp có danh mục con
            // 'direct_link' => 'required', # Trường hợp có liên kết cụ thể
            'url_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'title.required' => 'Tiêu đề là bắt buộc',
            'title.max' => 'Tiêu đề không được vượt quá 50 ký tự',
            'direct_type.required' => 'Bạn chưa chọn loại liên kết',
            'direct_value.required' => 'Ban phải chọn liên kết cụ thể',
            // "direct_link.required" => 'Bạn chưa chọn liên kết',
            'url_image.image' => 'File upload phải là một tệp hình ảnh',
            'url_image.mimes' => 'File upload chỉ nhận định dạng jpeg, png hoặc jpg',
            'url_image.max' => 'Ảnh không được vượt quá 2MB',
        ]);
        if ($validator->fails()) {
            return $this->error($validator->errors(), 422);
        } else {
            if ($request->hasFile('url_image')) {
                $check = $this->deleteImageFromCloudinary($banner->url_image);

                //
                $bannerImage = $this->uploadImageToCloudinary($request->file('url_image'), ['quantity' => 100, 'folder' => 'uploads-banner']);
            } else {
                $bannerImage = ['public_id' => $banner->image];
            }
            // # Ghép đường dẫn
            // $baseUrl = env('APP_FE_URL') ; # Đường dẫn gốc
            if ($request->sub_direct_value == "#" || $request->sub_direct_value == null) {
                $direct_link = "/" . $request->direct_type . '/' . $request->direct_value;
            } else if ($request->sub_direct_value != null || $request->sub_direct_value != "#") {
                $direct_link = "/" . $request->direct_type . '/' . $request->sub_direct_value;
            } else {
                $direct_link = "/" . $request->direct_type . '/' . $request->direct_value . '/' . $request->sub_direct_value;
            }



            # Cập nhật banner
            $updated = $banner->update([
                'title' => $request->title,
                'direct_link' => $direct_link,
                'url_image' => $bannerImage['public_id'],
            ]);
            if (!$updated) {
                return $this->error('Cập nhật banner thất bại', 500);
            } else {
                $banner = $banner->refresh([
                    'id',
                    'title',
                    'direct_link',
                    'url_image',
                    'updated_at'
                ]);
                return $this->success($banner, "Cập nhật banner thành công", 200);
            }
        }
    }
}
