<?php

namespace App\Http\Controllers\Api\Admin;


use App\Models\Category;
use Cloudinary\Cloudinary;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Admin\CategoryResource;

class CategoryController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $parentCategories = Category::query()->whereNull('parent_id')->get();
        $childCategories = Category::query()->whereNotNull('parent_id')->get();
        if ($parentCategories->isEmpty()) {
            return $this->success([], "Không có danh mục");
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
            $request->only(['name', 'parent_id', 'image']),
            [
                'name' => 'required|string|max:255',

                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ],
            [

                'name.required' => 'Tên danh mục là bắt buộc',
                'name.string' => 'Tên danh mục phải là chuỗi',
                'name.max' => 'Tên danh mục không được vượt quá 255 ký tự',

                'image.image' => 'File upload phải là một tệp hình ảnh',
                'image.mimes' => 'File upload chỉ nhận định dạng jpeg, png hoặc jpg',
                'image.max' => 'Ảnh không được vượt quá 2MB',
                'image.required' => "Bạn chưa chọn ảnh"
            ]
        );
        if ($validator->fails() || !$request->hasFile('image')) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        } else {
            $cloudinary = new Cloudinary();
            $uploadedFileUrl = $cloudinary->uploadApi()->upload(
                $request->image->getRealPath(),
                ['folder' => 'my-uploads']
            );
            $category = Category::create([
                'name' => $request->name,
                'parent_id' => $request->parent_id,
                'image' => $uploadedFileUrl['secure_url'],
            ]);
            $data = response()->json([
                'id' => $category->id,

                'name' => $category->name,
                'parent_id' => $category->parent_id,
                'image' => $category->image,
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
            return response()->json($category, 200);
        }
    }


    public function update(Request $request, string $id)
    {

        $category = Category::find($id);
        if ($category == null) {
            return $this->error('Danh mục không tồn tại', [], 404);
        } else {
            $validator = Validator::make(
                $request->only(['name', 'parent_id', 'image']),
                [
                    'name' => 'required|string|max:255',

                    'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                ],
                [

                    'name.required' => 'Tên danh mục là bắt buộc',
                    'name.string' => 'Tên danh mục phải là chuỗi',
                    'name.max' => 'Tên danh mục không được vượt quá 255 ký tự',

                    'image.image' => 'File upload phải là một tệp hình ảnh',
                    'image.mimes' => 'File upload chỉ nhận định dạng jpeg, png hoặc jpg',
                    'image.max' => 'Ảnh không được vượt quá 2MB',
                    'image.required' => "Bạn chưa chọn ảnh"
                ]
            );
            if ($validator->fails()) {
                return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
            } else {

                if ($request->hasFile('image')) {
                    $cloudinary = new Cloudinary();
                    if ($category->image) {
                        // Xóa ảnh cũ nếu có
                        $cloudinary->uploadApi()->destroy($category->image);
                    }
                    $uploadedFileUrl = $cloudinary->uploadApi()->upload(
                        $request->image->getRealPath(),
                        ['folder' => 'my-uploads']
                    );
                } else {
                    $uploadedFileUrl = ['secure_url' => $category->image]; // Giữ nguyên ảnh cũ nếu không có ảnh mới
                }

                $category->update([
                    'name' => $request->name,
                    'parent_id' => $request->parent_id,
                    'image' => $uploadedFileUrl['secure_url'],
                ]);
                return $this->success($category, "Cập nhật danh mục thành công", 200);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        // return response()->json($category);
        if ($category == null) {
            return $this->error('Danh mục không tồn tại', [], 404);
        } else {
            if ($category->products()->count() > 0) {
                return $this->error('Không thể xóa vì danh mục đang chứa sản phẩm', [], 400);
            } else {
                // Kiểm tra xem danh mục có phải là danh mục cha không
                if ($category->parent_id == null) {
                    $subcategories = Category::where('parent_id', $id)->get();
                    # Nếu danh mục cha không có danh mục con thì cho xóa
                    if (!$subcategories->isEmpty()) {
                        return $this->error(['Không thể xóa danh mục cha vì đang chứa danh mục con '], "Xóa danh mục thất bại", 403); #403 Forbidden Hành động vị phạm luật
                    } else {
                        // Xóa ảnh nếu có
                        if ($category->image) {
                            $cloudinary = new Cloudinary();
                            $cloudinary->uploadApi()->destroy($category->image);
                        }
                        $category->delete();
                        return $this->success([], "Xóa danh mục thành công", 200);
                    }
                } else {
                    // Xóa ảnh nếu có
                    if ($category->image) {
                        $cloudinary = new Cloudinary();
                        $cloudinary->uploadApi()->destroy($category->image);
                    }
                    $category->delete();
                    return $this->success([], "Xóa danh mục thành công", 200);
                }
            }
        }
    }
}
