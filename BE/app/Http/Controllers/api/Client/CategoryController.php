<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        //lấy danh mục đang còn hoạt động
        $listCategory = Category::query()->get();


        //Lấy riêng danh mục cha
        $parentCategories = $listCategory->whereNull('parent_id');

        //Báo lỗi nếu không có danh mục cha
        if ($parentCategories->isEmpty()) {
            return response()->json([], 200);
        }

        return new CategoryResource($parentCategories, $listCategory);
    }
}
