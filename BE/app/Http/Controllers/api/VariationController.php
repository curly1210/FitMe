<?php

namespace App\Http\Controllers\Api;

use App\Models\Size;
use App\Models\Color;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use App\Http\Resources\ColorResource;
use Illuminate\Support\Facades\Validator;

class VariationController extends Controller
{
    use ApiResponse;

    //show danh sách màu sắc và kích thước
    public function index()
    {
        return $this->success([
            'colors' => ColorResource::collection(Color::whereNull('deleted_at')->get()),
            'sizes' => SizeResource::collection(Size::whereNull('deleted_at')->get()),
        ], 'Lấy danh sách màu sắc và kích thước thành công');
    }

    //hàm tạo mới màu sắc

    public function storeColor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:10'
        ]);

        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }

        $color = Color::create($validator->validated());
        return $this->success($color, 'Tạo màu thành công', 201);
    }




    //hàm cập nhật màu sắc
    public function updateColor(Request $request, $id)
    {

        $color = Color::find($id);
        if (!$color)
            return $this->error('Màu sắc không tồn tại', [], 404);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:10'
        ]);

        if ($validator->fails()) {
            return $this->error('Dữ liệu màu sắc không hợp lệ không hợp lệ', $validator->errors(), 422);
        }

        $color->update($validator->validated());
        return $this->success($color, 'Cập nhật màu thành công');

    }









    //SIZE

    //hàm tạo mới kích thước

    public function storeSize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
        ]);
        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }



        $size = Size::create($validator->validated());

        return $this->success($size, 'Tạo kích thước thành công', 201);
    }

    //hàm cập nhật kích thước
    public function updateSize(Request $request, $id)
    {
        $size = Size::findOrFail($id);
        if (!$size) {
            return $this->error('Kích thước không tồn tại', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
        ]);
        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }


        $size->update([
            'name' => $request->name,
        ]);

        return $this->success($size, 'Cập nhật kích thước thành công');
    }



}
