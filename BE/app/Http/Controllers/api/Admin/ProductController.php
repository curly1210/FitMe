<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
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

            // Phân trang
            // $perPage = $request->input('per_page', 10); // Mặc định 10 sản phẩm/trang
            // $page = $request->input('page', 1); // Trang mặc định là 1
            // $offset = ($page - 1) * $perPage;
            // $total = $query->count();
            // $products = $query->offset($offset)->limit($perPage)->get();

            // return response()->json([
            //     'products' => $products->map(function ($product) {
            //         return [
            //             'id' => $product->id,
            //             'name' => $product->name,
            //             'total_inventory' => $product->total_inventory,
            //             'category_id' => $product->category_id,
            //             'is_active' => $product->is_active,
            //         ];
            //     }),
            //     'pagination' => [
            //         'total' => $total,
            //         'per_page' => $perPage,
            //         'current_page' => $page,
            //         'last_page' => ceil($total / $perPage),
            //         'from' => $offset + 1,
            //         'to' => min($offset + $perPage, $total),
            //     ],
            // ]);

            // Lấy tất cả dữ liệu
            $products = $query->with(['category', 'productItems.productImages'])->orderBy('id', 'desc')->get();

            // Định dạng dữ liệu sản phẩm
            $productArray = $products->map(function ($product) {
                // Lấy ảnh đầu tiên
                $image = null;
                if ($product->productItems->isNotEmpty()) {
                    $firstProductItem = $product->productItems->first();
                    if ($firstProductItem->productImages->isNotEmpty()) {
                        $image = $firstProductItem->productImages->first()->url;
                    }
                }

                return [
                    'id' => $product->id,
                    'category_id' => $product->category_id,
                    'category_name' => $product->category ? $product->category->name : "Không có danh mục", // Tên danh mục
                    'name' => $product->name,
                    'total_inventory' => $product->total_inventory,
                    'is_active' => $product->is_active,
                    'image' => $image, // Ảnh đầu tiên
                ];
            })->toArray();

            
            return response()->json($productArray);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Lỗi khi lấy danh sách sản phẩm', 'message' => $th->getMessage()], 500);
        }
    }
}
