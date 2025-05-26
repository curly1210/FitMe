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
    public function listColor()
    {
        return ColorResource::collection(Color::whereNull('deleted_at')->get());
        // return $this->success([
        //     'colors' => ColorResource::collection(Color::whereNull('deleted_at')->get()),
        // ], 'Lấy danh sách màu sắc thành công');
    }

    //Lấy ra danh sách các biến thể đã xóa

    public function trashedColor()
    {
        $trashedColors = ColorResource::collection(Color::onlyTrashed()->get());

        return $this->success([
            'colors' => $trashedColors,
        ], 'Danh sách màu sắc đã xóa mềm');
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


    public function showColor($id)
    {
        $color = Color::find($id);
        if (!$color) {
            return $this->error('Màu sắc không tồn tại', [], 404);
        }

        return $this->success(new ColorResource($color), 'Lấy thông tin màu sắc thành công');
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



    // Xóa mềm màu sắc
    public function deleteColor($id)
    {
        $color = Color::find($id);

        if (!$color) {
            return $this->error('Màu sắc không tồn tại', [], 404);
        }

        $color->delete();

        return $this->success(null, 'Xóa màu sắc thành công');
    }

    // Khôi phục lại màu sắc đã xóa mềm
    public function restoreColor($id)
    {
        $color = Color::onlyTrashed()->find($id);
        if (!$color) {
            return $this->error('Màu không tồn tại hoặc chưa xóa', [], 404);
        }

        $color->restore();

        return $this->success(new ColorResource($color), 'Khôi phục màu sắc thành công');
    }

    // Xóa vĩnh viễn màu sắc
    public function ForceDeleteColor($id)
    {
        $color = Color::onlyTrashed()->find($id);
        if (!$color) {
            return $this->error('Màu sắc chưa được xóa mềm', [], 404);
        }

        // Xét màu sắc có sản phẩm hay không nếu có thì báo lỗi
        if ($color->productItems()->exists()) {
            return $this->error('Không thể xóa màu sắc vì đang có màu sắc', [], 400);
        }

        //Sau khi màu sắc không có sản phẩm tiến hành xóa vĩnh viễn
        $color->forceDelete();

        return $this->success(null, 'Đã xóa vĩnh viễn màu sắc');
    }








    //SIZE

    //hàm tạo mới kích thước

    public function listSize()
    {
        return SizeResource::collection(Size::whereNull('deleted_at')->get());
        // return $this->success([

        //     'sizes' => SizeResource::collection(Size::whereNull('deleted_at')->get()),
        // ], 'Lấy danh sáchkích thước thành công');
    }

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
    public function showSize($id)
    {
        $size = Size::find($id);
        if (!$size) {
            return $this->error('Kích thước không tồn tại', [], 404);
        }

        return $this->success(new SizeResource($size), 'Lấy thông tin kích thước thành công');
    }

    // Xóa mềm kích thước
    public function deleteSize($id)
    {
        $size = Size::find($id);

        if (!$size) {
            return $this->error('Kích thước không tồn tại', [], 404);
        }

        $size->delete();

        return $this->success(null, 'Xóa kích thước thành công');
    }

    // Khôi phục lại biến thể đã xóa mềm
    public function restoreSize($id)
    {
        $size = Size::onlyTrashed()->find($id);
        if (!$size) {
            return $this->error('Màu không tồn tại hoặc chưa xóa', [], 404);
        }

        $size->restore();

        return $this->success(new SizeResource($size), 'Khôi phục kích thước thành công');
    }

    // Xóa viễn viễn kích thước
    public function ForceDeleteSize($id)
    {
        $size = Size::onlyTrashed()->find($id);
        if (!$size) {
            return $this->error('Kích thước chưa được xóa mềm', [], 404);
        }

        // Xét kích thước có sản phẩm hay không nếu có thì báo lỗi
        if ($size->productItems()->exists()) {
            return $this->error('Không thể xóa kích thước vì đang có biến thể', [], 400);
        }

        //Sau khi kích thước không có sản phẩm tiến hành xóa vĩnh viễn
        $size->forceDelete();

        return $this->success(null, 'Đã xóa vĩnh viễn kích thước');
    }

    public function trashedSize()
    {
        $trashedSizes = SizeResource::collection(Size::onlyTrashed()->get());

        return $this->success([
            'sizes' => $trashedSizes
        ], 'Danh sách kích thước đã xóa mềm');
    }
}
