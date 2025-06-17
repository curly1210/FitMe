<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Resources\Admin\CommentResource;
use App\Models\Product;
use App\Traits\ApiResponse;


class CommentController extends Controller
{
    //
    use ApiResponse;
    public function show($id)
    {
        $product = Product::with(['comments.user','productItems','productImages'])->findOrFail($id);
        return response()->json(new CommentResource($product));
    }
}
