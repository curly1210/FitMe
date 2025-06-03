<?php

namespace App\Http\Controllers\api\Client;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ProductResource;
use App\Http\Resources\Client\ProductDetailResource;

class ProductController extends Controller
{

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
            'productItems.images',  // load ảnh cho productItems
        ])->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->get();

        $product->setRelation('relatedProducts', $relatedProducts);

        return response()->json(
            new ProductDetailResource($product),
        );
    }






}