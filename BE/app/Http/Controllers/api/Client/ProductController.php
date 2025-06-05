<?php

namespace App\Http\Controllers\api\Client;


use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ProductResource;
use App\Http\Resources\Client\ProductDetailResource;
use App\Models\Category;
class ProductController extends Controller
{

    use ApiResponse;

    public function index(Request $request)
    {
        $query = Product::query()->where('is_active', 1)->with([
            'category',
            'productItems' => function ($query) {

                $query->where('is_active', 1)->with([
                    'color',
                    'size',
                    'productImages' => function ($query) {
                        $query->where('is_active', 1);
                    }
                ]);

            }
        ]);

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        //  TÌm kiếm theo tên
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        // Phan trang
        $products = $query->paginate(10);

        return ProductResource::collection($products);
    }

    /**
     * Display the specified product.
     *
     * @param int $id
     * @return ProductResource
     */
    // public function show($id)
    // {
    //     $product = Product::query()->where('is_active', 1)->with(['category','productItems' => function ($query) {
    //                 $query->where('is_active', 1)->with(['color', 'size', 'productImages' => function ($query) {
    //                     $query->where('is_active', 1);
    //                 }]);
    //             }
    //         ])->findOrFail($id);

    //     return new ProductResource($product);
    // }

























































































































































































































































    public function show($slug)
    {

        $product = Product::with([
            'category',
            'productItems.color',
            'productItems.size',
            'reviews.user',
            'reviews.reviewImages',
            'comments.user',
            'images', 
        ])->where('slug', $slug)->firstOrFail();


        return new ProductDetailResource($product);
    }

    public function getProductByCategory(string $slug)
    {
        $category = Category::query()->where('slug', 'LIKE', $slug)->first(['name', 'id', 'slug', 'parent_id']);

        if ($category != null) {
            # Trường hợp danh mục con
            if ($category->parent_id != null) {
                $products = Product::query()->where('category_id', $category->id)->paginate(8);
            } else {

                $subCategoryIds = Category::query()->where('parent_id', $category->id)->pluck('id')->toArray();

                $products = Product::query()->whereIn('category_id', $subCategoryIds)->paginate(8);
            }
            ;

            return ProductResource::collection($products)->additional(['total_products' => $products->total()]);
        } else {
            return $this->error("Danh mục không tồn tại", "Không tìm thấy danh mục", 404);
        }
    }
}

