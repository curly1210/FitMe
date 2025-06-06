<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductItem;
use App\Traits\ApiResponse;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use CloudinaryTrait;
    use ApiResponse;

    //
    public function index(Request $request)
    {
        try {
            $query = Product::query();

            // Tìm kiếm theo name
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%");
            }

            // Lọc theo category_id
            if ($request->has('category_id')) {
                $categoryId = $request->input('category_id');
                $query->where('category_id', $categoryId);
            }

            // Lọc theo is_active
            if ($request->has('is_active')) {
                $isActive = $request->input('is_active');
                $query->where('is_active', $isActive);
            }
            // Lấy tất cả dữ liệu
            $products = $query->with(['category', 'productImages'])->orderBy('id', 'desc')->get();

            // Định dạng dữ liệu sản phẩm
            $productArray = $products->map(function ($product) {
                // Lấy ảnh đầu tiên trong danh sách ảnh (theo color_id đầu tiên của sản phẩm)
                $image = optional($product->productImages->first())->url;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category_id' => $product->category_id,
                    'category_name' => optional($product->category)->name ?? 'Không có danh mục',
                    'total_inventory' => $product->total_inventory,
                    'is_active' => $product->is_active,
                    'image' => $this->buildImageUrl($image),
                ];
            });

            return response()->json($productArray);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy danh sách sản phẩm', $th->getMessage(), 500);
        }
    }

    private function generateSKU($categoryName, $productId, $year, $colorId, $sizeId)
    {
        $yearPart = substr($year, -2);
        $categoryName = Str::ascii($categoryName);
        $words = explode(' ', $categoryName);
        $categoryPart = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $categoryPart .= strtoupper($word[0]);
            }
        }

        $genderPart = Str::contains(strtolower($categoryName), 'nam') ? 'M' : 'W';
        $unique = rand(100, 999);
        return "{$yearPart}{$categoryPart}{$productId}{$genderPart}{$unique}_C{$colorId}S{$sizeId}";
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'short_description' => 'required|string',
                'description' => 'required|string',
                'variants' => 'required|array|min:1',
                'variants.*.color_id' => 'required|exists:colors,id',
                'variants.*.size_id' => 'required|exists:sizes,id',
                'variants.*.stock' => 'required|integer|min:0',
                'variants.*.import_price' => 'required|numeric|min:0',
                'variants.*.price' => 'required|numeric|min:0',
                'variants.*.sale_price' => 'nullable|numeric|min:0',
                'images' => 'required|array|min:1',
                'images.*.url' => 'required|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images.*.color_id' => 'required|exists:colors,id',
                'is_active' => 'nullable|boolean',
            ]);

            DB::beginTransaction();

            $slug = Str::slug($validatedData['name']);
            $product = Product::create([
                'name' => $validatedData['name'],
                'category_id' => $validatedData['category_id'],
                'short_description' => $validatedData['short_description'],
                'description' => $validatedData['description'],
                'slug' => $slug,
                'is_active' => $validatedData['is_active'] ?? 1,
            ]);

            // Lấy categoryName
            $category = $product->category;
            if (!$category) {
                throw new \Exception("Danh mục với ID {$validatedData['category_id']} không tồn tại.");
            }
            $categoryName = $category->name;

            // Lấy năm hiện tại
            $year = date('Y');

            $totalInventory = 0;
            foreach ($validatedData['variants'] as $variant) {
                $totalInventory += $variant['stock'];

                $salePrice = null;
                if (!empty($variant['sale_price'])) {
                    $percentage = $variant['sale_price'];
                    $discount = $variant['price'] * ($percentage / 100);
                    $salePrice = $variant['price'] - $discount;
                }

                // Tạo SKU
                $sku = $this->generateSKU($categoryName, $product->id, $year, $variant['color_id'], $variant['size_id']);

                ProductItem::create([
                    'product_id' => $product->id,
                    'color_id' => $variant['color_id'],
                    'size_id' => $variant['size_id'],
                    'sku' => $sku,
                    'stock' => $variant['stock'],
                    'import_price' => $variant['import_price'],
                    'price' => $variant['price'],
                    'sale_price' => $salePrice,
                ]);
            }

            $product->update(['total_inventory' => $totalInventory]);

            foreach ($validatedData['images'] as $imageData) {
                $file = $imageData['url'];
                $uploadResult = $this->uploadImageToCloudinary($file, [
                    // 'width' => 600,
                    // 'height' => 600,
                    'quality' => 80,
                    'folder' => "products/{$product->id}",
                ]);

                ProductImage::create([
                    'product_id' => $product->id,
                    'color_id' => $imageData['color_id'],
                    'url' => $uploadResult['public_id'],
                ]);
            }

            DB::commit();

            return $this->success([
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category_id' => $product->category_id,
                    'short_description' => $product->short_description,
                    'description' => $product->description,
                    'slug' => $product->slug,
                    'total_inventory' => $product->total_inventory,
                    'is_active' => $product->is_active,
                ],
            ], 'Sản phẩm đã được thêm thành công.', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Dữ liệu không hợp lệ.', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Lỗi khi thêm sản phẩm.', $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'short_description' => 'required|string',
                'description' => 'required|string',
                'variants' => 'required|array|min:1',
                'variants.*.color_id' => 'required|exists:colors,id',
                'variants.*.size_id' => 'required|exists:sizes,id',
                'variants.*.stock' => 'required|integer|min:0',
                'variants.*.import_price' => 'required|numeric|min:0',
                'variants.*.price' => 'required|numeric|min:0',
                'variants.*.sale_price' => 'nullable|numeric|min:0',
                'images' => 'sometimes|array|min:1',
                'images.*.url' => 'required|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images.*.color_id' => 'required|exists:colors,id',
                'is_active' => 'nullable|boolean',
            ]);

            DB::beginTransaction();

            $slug = Str::slug($validatedData['name']);

            $product->update([
                'name' => $validatedData['name'],
                'category_id' => $validatedData['category_id'],
                'short_description' => $validatedData['short_description'],
                'description' => $validatedData['description'],
                'slug' => $slug,
                'is_active' => $validatedData['is_active'] ?? 1,
            ]);

            // Xóa các product_items cũ và thêm lại từ biến thể mới
            ProductItem::where('product_id', $product->id)->delete();

            $totalInventory = 0;
            foreach ($validatedData['variants'] as $variant) {
                $totalInventory += $variant['stock'];

                $salePrice = null;
                if (!empty($variant['sale_price'])) {
                    $percentage = $variant['sale_price'];
                    $discount = $variant['price'] * ($percentage / 100);
                    $salePrice = $variant['price'] - $discount;
                }

                $categoryName = $product->category ? $product->category->name : 'unknown';
                $year = date('Y');

                $sku = $this->generateSKU($categoryName, $product->id, $year, $variant['color_id'], $variant['size_id']);

                ProductItem::create([
                    'product_id' => $product->id,
                    'color_id' => $variant['color_id'],
                    'size_id' => $variant['size_id'],
                    'sku' => $sku,
                    'stock' => $variant['stock'],
                    'import_price' => $variant['import_price'],
                    'price' => $variant['price'],
                    'sale_price' => $salePrice,
                ]);
            }

            $product->update(['total_inventory' => $totalInventory]);

            // Nếu có dữ liệu ảnh mới, xử lý cập nhật ảnh
            if (!empty($validatedData['images'])) {
                $colorIds = collect($validatedData['images'])->pluck('color_id')->unique();

                // Xóa ảnh cũ trên Cloudinary và database theo từng color_id mới được cập nhật
                foreach ($colorIds as $colorId) {
                    $oldImages = ProductImage::where('product_id', $product->id)
                        ->where('color_id', $colorId)
                        ->get();

                    foreach ($oldImages as $oldImage) {
                        // Xóa ảnh trên Cloudinary
                        $this->deleteImageFromCloudinary($oldImage->url);

                        // Xóa record ảnh trong DB
                        $oldImage->delete();
                    }
                }

                // Thêm ảnh mới
                foreach ($validatedData['images'] as $imageData) {
                    $file = $imageData['url'];
                    $uploadResult = $this->uploadImageToCloudinary($file, [
                        'width' => 600,
                        'height' => 600,
                        'quality' => 80,
                        'folder' => "products/{$product->id}",
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'color_id' => $imageData['color_id'],
                        'url' => $uploadResult['public_id'],
                    ]);
                }
            }

            DB::commit();

            // Load lại đầy đủ các quan hệ sau khi cập nhật
            $product->load([
                'category',
                'items.color',
                'items.size',
                'images.color',
            ]);

            return $this->success([], 'Cập nhật sản phẩm thành công.', 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Dữ liệu không hợp lệ.', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Lỗi khi cập nhật sản phẩm.', $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with([
                'category' => function ($query) {
                    $query->select('id', 'name', 'slug');
                },
                'productItems.color' => function ($query) {
                    $query->select('id', 'name');
                },
                'productItems.size' => function ($query) {
                    $query->select('id', 'name');
                },
                'productImages.color' => function ($query) {
                    $query->select('id', 'name');
                }
            ])->whereNull('deleted_at')->findOrFail($id);

            return new ProductResource($product);
        } catch (\Exception $e) {
            return $this->error('Lỗi khi xem chi tiết sản phẩm.', $e->getMessage(), 500);
        }
    }

    public function delete($id)
    {
        try {
            $product = Product::whereNull('deleted_at')->find($id);
            if (!$product) {
                return $this->error('Sản phẩm không tồn tại hoặc đã bị xóa.', null, 404);
            }
            DB::beginTransaction();

            $product->update(['is_active' => 0]);

            $product->delete();

            DB::commit();
            return $this->success(null, 'Xóa mềm sản phẩm thành công', 200);
        } catch (\Exception $e) {
            //throw $th;
            DB::rollBack();
            return $this->error('Lỗi khi xóa mềm', $e->getMessage(), 403);
        }
    }

    public function trash(Request $request)
    {
        try {
            $query = Product::onlyTrashed();

            // Tìm kiếm theo name
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%");
            }

            // Lọc theo category_id
            if ($request->has('category_id')) {
                $categoryId = $request->input('category_id');
                $query->where('category_id', $categoryId);
            }

            // Lấy danh sách sản phẩm trong thùng rác
            $products = $query->with(['category', 'productImages'])->orderBy('deleted_at', 'desc')->get();

            // Định dạng dữ liệu sản phẩm
            $productArray = $products->map(function ($product) {
                $image = optional($product->productImages->first())->url;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category_id' => $product->category_id,
                    'category_name' => optional($product->category)->name ?? 'Không có danh mục',
                    'total_inventory' => $product->total_inventory,
                    'is_active' => $product->is_active,
                    'image' => $this->buildImageUrl($image),
                    'deleted_at' => $product->deleted_at,
                ];
            });

            return response()->json($productArray);
        } catch (\Exception $e) {
            return $this->error('Lỗi khi lấy danh sách sản phẩm trong thùng rác.', $e->getMessage(), 500);
        }
    }


    public function restore($id)
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);

            if (!$product) {
                return $this->error('Sản phẩm không tồn tại hoặc đã bị xóa.', null, 404);
            }
            DB::beginTransaction();

            $product->update(['is_active' => 1]);

            // Khôi phục sản phẩm
            $product->restore();

            DB::commit();

            return $this->success(null, 'Sản phẩm đã được khôi phục thành công.', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Lỗi khi khôi phục sản phẩm.', $e->getMessage(), 500);
        }
    }
    public function destroy($id)
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);
            if (!$product) {
                return $this->error('Sản phẩm không tồn tại hoặc đã bị xóa.', null, 404);
            }

            DB::beginTransaction();

            // 1. Xóa từng ảnh trong folder bằng deleteImageFromCloudinary
            $images = ProductImage::where('product_id', $product->id)->get();
            foreach ($images as $image) {
                $this->deleteImageFromCloudinary($image->url); // Xóa Cloudinary
                $image->forceDelete();                          // Xóa trong DB
            }

            // 2. Xóa folder sau khi đã xóa toàn bộ ảnh
            $folderPath = 'products/' . $product->id;
            $this->deleteFolderFromCloudinary($folderPath);

            // 3. Xóa product items
            ProductItem::where('product_id', $product->id)->forceDelete();

            // 4. Xóa chính sản phẩm
            $product->forceDelete();

            DB::commit();
            return $this->success(null, 'Sản phẩm đã được xóa vĩnh viễn thành công.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Lỗi khi xóa vĩnh viễn sản phẩm.', $e->getMessage(), 500);
        }
    }
}
