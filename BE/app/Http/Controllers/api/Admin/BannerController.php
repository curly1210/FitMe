<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\Banner;
use App\Models\Product;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\BannerResource;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index()
    {
        $banners = Banner::query()->get(['id', 'title', 'url_image']);
        if ($banners->isEmpty()) {
            return $this->success([], "không có banner", 200);
        } else {

            return response()->json(
                $banners->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->title,
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
            return response()->json([
                'id' => $banner->id,
                'title' => $banner->title,
                'direct_link' => $banner->direct_link,
                'url_image' => $this->buildImageUrl($banner->url_image),
            ], 200);
        } else {
            return $this->error('Không tìm thấy banner', 404);
        }
    }

    public function edit($id)
    {
        $banner = Banner::find($id);
        if ($banner) {
            $childCategories = Category::query()->whereNotNull('parent_id')->where('is_active', '=', 1)->get(['id', 'name', 'parent_id']);
            $parentCategories = Category::query()->whereNull('parent_id')->Where('is_active', '=', 1)->get(['id', 'name', 'parent_id']);

            $products = Product::query()->where('is_active', "=", 1)->orderBy('created_at', 'desc')->get(['id', 'name', 'slug', 'category_id', 'is_active'])->take(30);
            $posts = Post::query()->where('is_active', "=", 1)->orderBy('created_at', 'desc')->get(['id', 'title', 'is_active'])->take(10);
            return new BannerResource($banner, $parentCategories, $childCategories, $products, $posts);
        } else {
            return $this->error('Không tìm thấy banner', 404);
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
            'url_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'title.required' => 'Tiêu đề là bắt buộc',
            'title.max' => 'Tiêu đề không được vượt quá 50 ký tự',
            'direct_type.required' => 'Bạn chưa chọn loại liên kết',
            'direct_value.required' => 'Ban chưa chọn liên kết cụ thể',
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
            # Ghép đường dẫn
            $direct_link = env('APP_URL') . ":8000" . "/" . $request->direct_type . '/' . $request->direct_value;


            # Cập nhật banner
            $check = $banner->update([
                'title' => $request->title,
                'direct_link' => $direct_link,
                'url_image' => $bannerImage['public_id'],

            ]);
            if (!$check) {
                return $this->error('Cập nhật banner thất bại', 500);
            } else {

                return $this->success($check, "Cập nhật banner thành công", 200);
            }
        }
    }
}
