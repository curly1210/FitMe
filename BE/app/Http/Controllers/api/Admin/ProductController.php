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
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpParser\Node\Stmt\TryCatch;

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
                'variants.*.sale_price' => 'nullable',
                'variants.*.sale_percent' => 'nullable|numeric|min:0',
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

                $salePrice = $variant['price'];
                if (!empty($variant['sale_percent']) && $variant['sale_percent'] > 0) {
                    $discount = $variant['price'] * ($variant['sale_percent'] / 100);
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
                    'sale_percent' => $variant['sale_percent'],
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
                    'total_inventory' => $product->total_inventory,
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
                'variants.*.id' => 'required',
                'variants.*.sale_price' => 'nullable',
                'variants.*.sale_percent' => 'nullable|numeric|min:0',
                'images' => 'required|array|min:1',
                // 'images.*.url' => 'nullable',

                'images.*.url' => [
                    'required_with:images|file|mimes:jpeg,png,jpg,webp|max:2048|nullable',
                    fn ($att, $val, $fail) =>
                    !is_string($val) && !($val instanceof \Illuminate\Http\UploadedFile)
                        && $fail("The $att must be a file or string.")
                ],

                'images.*.color_id' => 'required|exists:colors,id',
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
            // ProductItem::where('product_id', $product->id)->delete();
            // ProductItem::where('product_id', $product->id)->forceDelete();

            // Lưu lại tất cả ID từ FE gửi lên
            $inputIds = [];


            // Lấy danh sách ID hiện tại trong DB theo product
            $existingIds = ProductItem::where('product_id', $product->id)->pluck('id')->toArray();

            $totalInventory = 0;
            foreach ($validatedData['variants'] as $variant) {
                $inputIds[] = $variant['id'];
                // $totalInventory += $variant['stock'];

                // Tính sale_price dựa trên sale_percent nếu có
                $salePrice = $variant['price']; // Giá mặc định là price
                $salePercent = $variant['sale_percent'] ?? null;
                if ($salePercent !== null && $salePercent > 0) {
                    $discount = $variant['price'] * ($salePercent / 100);
                    $salePrice = $variant['price'] - $discount;
                } elseif (!empty($variant['sale_price'])) {
                    // Nếu sale_price được gửi lên nhưng không có sale_percent, giữ nguyên sale_price
                    $salePrice = $variant['sale_price'];
                }
                // Kiểm tra xem variant đã tồn tại trong DB chưa
                if (in_array($variant['id'], $existingIds)) {
                    // Đã tồn tại → cập nhật
                    ProductItem::where('id', $variant['id'])->update([
                        // 'color_id' => $variant['color'],
                        // 'size' => $variant['size'],
                        'stock' => $variant['stock'],
                        'import_price' => $variant['import_price'],
                        'price' => $variant['price'],
                        'sale_price' => $salePrice,
                        'sale_percent' => $salePercent,
                    ]);
                } else { // Chưa có → tạo mới

                    $categoryName = $product->category ? $product->category->name : 'unknown';
                    $year = date('Y');

                    $sku = $this->generateSKU($categoryName, $product->id, $year, $variant['color_id'], $variant['size_id']);
                    // Chưa có → tạo mới
                    ProductItem::create([
                        // 'id' => $variant['id'], // chỉ dùng nếu bạn cho phép tự set id
                        'product_id' => $product->id,
                        'color_id' => $variant['color_id'],
                        'size_id' => $variant['size_id'],
                        'sku' => $sku,
                        'stock' => $variant['stock'],
                        'import_price' => $variant['import_price'],
                        'price' => $variant['price'],
                        'sale_price' => $salePrice,
                        'sale_percent' => $salePercent,
                    ]);
                    // $salePrice = null;
                    // if (!empty($variant['sale_price'])) {
                    //     $percentage = $variant['sale_price'];
                    //     $discount = $variant['price'] * ($percentage / 100);
                    //     $salePrice = $variant['price'] - $discount;

                }

                $totalInventory += $variant['stock'];
            }
            // Cập nhật lại tổng số lượng tồn kho của sản phẩm
            $product->update(['total_inventory' => $totalInventory]);

            // Xóa các product_item không còn trong danh sách gửi lên
            $idsToDelete = array_diff($existingIds, $inputIds);
            ProductItem::whereIn('id', $idsToDelete)->delete();

            $inputUrls = [];

            // Lấy tất cả URL từ mảng API gửi lên
            foreach ($validatedData['images'] as $img) {
                // Nếu là UploadedFile thì lấy URL từ Cloudinary
                if (is_string($img['url'])) {
                    $inputUrls[] = $img['url'];
                }
            }
            // Lấy tất cả ảnh hiện tại trong DB theo product
            $existingImages = ProductImage::where('product_id', $product->id)->get();

            // Xóa các ảnh không còn trong danh sách gửi lên
            foreach ($existingImages as $dbImage) {
                $checkUrl = $this->buildImageUrl($dbImage->url);
                if (!in_array($checkUrl, $inputUrls)) {

                    $this->deleteImageFromCloudinary($dbImage->url);
                    $productDelete = ProductImage::find($dbImage->id);
                    $productDelete->delete();
                }
            }

            // Thêm mới các ảnh từ mảng API gửi lên
            foreach ($validatedData['images'] as $imageData) {
                $file = $imageData['url'];

                if ($file instanceof UploadedFile) {
                    $uploadResult = $this->uploadImageToCloudinary($file, [
                        // 'width' => 600,
                        // 'height' => 600,
                        'quality' => 80,
                        'folder' => "products/{$product->id}",
                    ]);


                    try {

                        ProductImage::create([
                            'product_id' => $product->id,
                            'color_id' =>  (int)$imageData['color_id'],
                            'url' => $uploadResult['public_id'],
                        ]);
                    } catch (\Throwable $th) {
                        return response()->json($th->getMessage());
                    }
                }
            }

            DB::commit();

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
                    'image' => $image,
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
            $product->forceDelete();
            DB::commit();

            return $this->success(null, 'Xóa vĩnh viễn sản phẩm thành công.', 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error('Lỗi khi xóa vĩnh viễn sản phẩm', $th->getMessage(), 403);
        }
    }
}
