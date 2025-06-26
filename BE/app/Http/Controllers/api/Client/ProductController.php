<?php

namespace App\Http\Controllers\api\Client;


use App\Models\Size;
use App\Models\Color;
use App\Models\Product;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ProductResource;
use App\Http\Resources\Client\ProductDetailResource;

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


    public function getProductsByCategory(Request $request, String $slug)
    {
        # Lấy tham số sau khi được endcode bên FE và giải mã decode các tham số
        $colors = json_decode($request->input('color'), true);
        $sizes = json_decode($request->input('size'), true);
        $prices = json_decode($request->input('price'), true);
        $sort = $request->query('sort');
        // dd($colors);
        $sort = strtolower($sort);
        if ($sort !== 'asc' && $sort !== 'desc') {
            $sort = 'asc';
        }
        $category = Category::query()->where('slug', 'LIKE', $slug)->first(['name', 'id', 'slug', 'parent_id']);

        if ($category != null) {
            # Trường hợp lọc sản phẩm theo danh mục con
            if ($category->parent_id != null) {
                $query = Product::query()->where('is_active', 1)->where('category_id', $category->id);
                $products = $this->filterProducts($query, $colors, $sizes, $prices, $sort);
            } else {
                # Trường hợp lọc sản phẩm theo danh mục cha
                $subCategoryIds = Category::query()->where('parent_id', $category->id)->pluck('id')->toArray();

                $query = Product::query()->where('is_active', 1)->whereIn('category_id', $subCategoryIds);
                $products = $this->filterProducts($query, $colors, $sizes, $prices, $sort);
            };
            # Trường hợp không có sản phẩm
            if ($products->count() == 0) {

                return $this->success([], "Không tìm thấy sản phẩm nào");
            }
            return ProductResource::collection($products)->additional(['total_products' => $products->total()]);
        } else {
            return $this->error("Danh mục không tồn tại", "Không tìm thấy danh mục", 404);
        }
    }

    public function getProductsByKeyWord(Request $request)
    {
        # Lấy tham số sau khi được endcode bên FE và giải mã decode các tham số
        $keyword = $request->input('keyword');
        $sort = $request->query('sort');
        $colors = json_decode($request->input('color'), true);
        $sizes = json_decode($request->input('size'), true);
        $prices = json_decode($request->input('price'), true);
        $sort = strtolower($sort);
        if ($sort !== 'asc' && $sort !== 'desc') {
            $sort = 'asc';
        }
        # Trường hợp có từ khóa tìm kiếm (lọc theo sku hoặc tên sản phẩm)
        if ($keyword != null) {
            $query = Product::query()->where('is_active', 1)->where(function ($query) use ($keyword) {
                $query->where('name', 'LIKE', '%' . $keyword . '%')
                    ->orWhereHas('productItems', function ($q) use ($keyword) {
                        $q->where('sku', 'LIKE', '%' . $keyword . '%');
                    });
            });
            $products = $this->filterProducts($query, $colors, $sizes, $prices, $sort);
            # Trường hợp không có sản phẩm
            if ($products->count() == 0) {

                return $this->success([], "Không tìm thấy sản phẩm nào");
            }
            return ProductResource::collection($products)->additional(['total_products' => $products->total()]);
        } else {
            $query = Product::query()->where('is_active', 1);
            $products = $this->filterProducts($query, $colors, $sizes, $prices, $sort);
            # Trường hợp không có sản phẩm
            if ($products->count() == 0) {

                return $this->success([], "Không tìm thấy sản phẩm nào");
            }
            return ProductResource::collection($products)->additional(['total_products' => $products->total()]);
        }
    }
    public function filterProducts($query, $colors = null, $sizes = null, $prices = null, $sort = null)
    {
        # Trường hợp lọc theo giá
        if (is_array($prices) && count($prices) === 2) {
            $min = min($prices[0], $prices[1]);
            $max = max($prices[0], $prices[1]);
            $query->whereHas('productItems', function ($q) use ($min, $max) {
                $q->whereBetween('sale_price', [$min, $max]);
            });
        }
        // Lấy giá nhỏ nhất từ productItems 
        $query->withMin(['productItems' => function ($q) {
            $q->where('is_active', 1);
        }], 'sale_price');

        // Sắp xếp theo giá nhỏ nhất
        if ($sort == 'desc') {
            // dd('ádv');
            $query->orderBy('product_items_min_sale_price', 'desc');
        }
        if ($sort == 'asc') {
            $query->orderBy('product_items_min_sale_price', 'asc');
        }


        # Trường hợp chỉ lọc theo color
        if (is_array($colors) && !is_array($sizes)) {
            return $query->whereHas('productItems', function ($q) use ($colors) {
                $q->whereIn('color_id', $colors);
            })
                ->orderBy('product_items_min_sale_price', $sort ?? 'asc')
                ->paginate(8);
        }
        # Trường hợp chỉ lọc theo size
        if (!is_array($colors) && is_array($sizes)) {
            return $query->whereHas('productItems', function ($q) use ($sizes) {
                $q->whereIn('size_id', $sizes);
            })
                ->orderBy('product_items_min_sale_price', $sort ?? 'asc')
                ->paginate(8);
        }
        # Trường hợp lọc theo cả size và color
        if (is_array($colors) && is_array($sizes)) {
            return $query->whereHas('productItems', function ($q) use ($colors, $sizes) {
                $q->whereIn('color_id', $colors)
                    ->whereIn('size_id', $sizes);
            })
                ->orderBy('product_items_min_sale_price', $sort ?? 'asc')
                ->paginate(8);
        }

        return $query->paginate(8);
    }
    public function getColors()
    {
        $colors = Color::query()->where('is_active', 1)->get(['id', 'code', 'name']);
        if ($colors == null) {
            return $this->success([], 'Không có màu sắc', 204);
        }
        return response()->json($colors);
    }
    public function getSizes()
    {
        $sizes = Size::query()->where('is_active', 1)->get(['id', 'name']);
        if ($sizes == null) {
            return $this->success([], 'Không có kích cỡ', 204);
        }
        return response()->json($sizes);
    }




















































































































































































































































    public function show($slug)
    {

        $product = Product::with([
            'category',
            'productItems.color',
            'productItems.size',
            'reviews.user',
            'reviews.reviewImages',
            'comments.user',
            'productImages',
        ])->where('slug', $slug)->firstOrFail();

        return new ProductDetailResource($product);
    }
}
