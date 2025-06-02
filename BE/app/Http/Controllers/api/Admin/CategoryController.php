<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Category;
use Cloudinary\Cloudinary;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use App\Http\Controllers\Controller;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Admin\CategoryResource;

class CategoryController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $parentCategories = Category::query()->whereNull('parent_id')->get();
        $childCategories = Category::query()->whereNotNull('parent_id')->get();
        if ($parentCategories->isEmpty()) {
            return response()->json([], 200);
        } else {
            return new CategoryResource($parentCategories, $childCategories);
        }
    }


    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->only(['name', 'parent_id', 'image', 'slug']),
            [
                'name' => 'required|string|max:255|unique:categories,name',

                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ],
            [

                'name.required' => 'Tên danh mục là bắt buộc',
                'name.string' => 'Tên danh mục phải là chuỗi',
                'name.max' => 'Tên danh mục không được vượt quá 255 ký tự',
                'name.unique' => 'Tên danh mục đã tồn tại',
                'image.image' => 'File upload phải là một tệp hình ảnh',
                'image.mimes' => 'File upload chỉ nhận định dạng jpeg, png, webp hoặc jpg',
                'image.max' => 'Ảnh không được vượt quá 2MB',
                'image.required' => "Bạn chưa chọn ảnh"
            ]
        );
        if ($validator->fails() || !$request->hasFile('image')) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        } else {

            $uploadedFileUrl = $this->uploadImageToCloudinary(
                $request->file('image'),
                ['quality' => 65, 'folder' => 'uploads-category']
            );

            $category = Category::create([
                'name' => $request->name,
                'parent_id' => ($request->parent_id === null || $request->parent_id === 'null')
                    ? null
                    : (int)$request->parent_id,
                'slug' => Str::slug($request->name, '-'),
                'image' => $uploadedFileUrl['public_id'],
            ]);
            $data = response()->json([
                'id' => $category->id,

                'name' => $category->name,
                'slug' => $category->slug,
                'parent_id' => $category->parent_id,
                'image' => $this->buildImageUrl($category->image),
            ]);

            return $this->success($data, "Thêm danh mục thành công", 201);
        }
    }
    // public function storeUploadImage(Request $request)
    // {
    //     if ($request->hasFile('images')) {
    //         $urls = [];
    //         $cloudinary = new Cloudinary();
    //         // dd($request->file('images'));
    //         foreach ($request->file('images') as $image) {
    //             if ($image->isValid()) {
    //                 $uploadedFileUrl = $cloudinary->uploadApi()->upload(
    //                     $image->getRealPath(),
    //                     ['folder' => 'my-uploads']
    //                 );

    //                 $urls[] = $uploadedFileUrl['secure_url']; // hoặc toàn bộ $uploadedFileUrl nếu cần
    //             }
    //         }

    //         return response()->json(['urls' => $urls]);
    //     }

    //     return response()->json(['error' => 'No valid files uploaded.'], 400);
    // }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::find($id);
        if ($category == null) {
            return $this->error('Danh mục không tồn tại', [], 404);
        } else {
            $cloudinary = new Cloudinary();
            return response()->json([
                "id" => $category->id,
                "name" => $category->name,
                "parent_id" => $category->parent_id,
                "image" => $cloudinary->adminApi()->asset($category->image)['secure_url'],
            ], 200);
        }
    }


    public function update(Request $request, string $id)
    {

        $category = Category::find($id);
        if ($category == null) {
            return $this->error('Danh mục không tồn tại', [], 404);
        } else {
            $validator = Validator::make(
                $request->only(['name', 'image', 'slug']),
                [
                    'name' => 'required|string|max:255|unique:categories,name,' . $id,

                    'image' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
                ],
                [

                    'name.required' => 'Tên danh mục là bắt buộc',
                    'name.string' => 'Tên danh mục phải là chuỗi',
                    'name.max' => 'Tên danh mục không được vượt quá 255 ký tự',
                    'name.unique' => 'Tên danh mục đã tồn tại',
                    'image.image' => 'File upload phải là một tệp hình ảnh',
                    'image.mimes' => 'File upload chỉ nhận định dạng jpeg, png, webp hoặc jpg',
                    'image.max' => 'Ảnh không được vượt quá 2MB',

                ]
            );
            if ($validator->fails()) {
                return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
            } else {

                if ($request->hasFile('image')) {

                    if ($category->image != null) {
                        // Xóa ảnh cũ nếu có
                        $this->deleteImageFromCloudinary($category->image);
                    }
                    $uploadedFileUrl = $this->uploadImageToCloudinary(
                        $request->file('image'),
                        ['quality' => 65, 'folder' => 'uploads-category']
                    );
                } else {
                    $uploadedFileUrl = ['public_id' => $category->image]; // Giữ nguyên ảnh cũ nếu không có ảnh mới
                }

                $category->update([
                    'name' => $request->name,
                    'image' => $uploadedFileUrl['public_id'],
                    'slug' => Str::slug($request->name, '-'),
                ]);
                $data = [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' =>  $category->slug,
                    'image' => $this->buildImageUrl($category->image),
                ];
                return $this->success($data, "Cập nhật danh mục thành công", 200);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $category = Category::withCount('products')->find($id);

        if (!$category) {
            return $this->error('Danh mục không tồn tại', [], 404);
        }

        // Nếu có sản phẩm thì không cho xóa
        if ($category->products_count > 0) {
            return $this->error('Không thể xóa vì danh mục đang chứa sản phẩm', [], 403);
        }
        $hasSubCategory = Category::where('parent_id', $id)->exists();
        // Nếu là danh mục cha và có danh mục con thì không cho xóa
        if (is_null($category->parent_id) && $hasSubCategory == true) {
            return $this->error(['Không thể xóa danh mục cha vì đang chứa danh mục con'], "Xóa danh mục thất bại", 403);
        }

        // Xóa ảnh nếu có
        $this->deleteImageFromCloudinary($category->image);

        $category->delete();
        return $this->success([], "Xóa danh mục thành công", 200);
    }
}
