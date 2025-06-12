<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CouponResource;
use App\Models\Coupon;
use App\Traits\ApiResponse;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    //
    use ApiResponse;
    public function index(Request $request)
    {
        $query = Coupon::query();

        //Tìm kiếm theo name hoặc code
        if ($request->has('keyword')) {
            $keyword = trim($request->input('keyword')); 
            if ($keyword !== '') { 
                $query->where(function ($q) use ($keyword) {
                    $q->where('name', 'like', "%{$keyword}%")->orWhere('code', 'like', "%{$keyword}%");
                });
            }
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $coupons = $query->paginate($perPage);

        return CouponResource::collection($coupons);
    }

    public function store(Request $request)
    {
        try {
            $validate = Validator::make($request->all(), [
                'name' => 'required|string|max:50',
                'code' => 'required|string|max:50|unique:coupons,code',
                'value' => 'required|integer|min:0',
                'time_start' => 'required|date|after:now',
                'time_end' => 'nullable|date|after_or_equal:time_start',
                'min_price_order' => 'required|integer|min:0',
                'max_price_discount' => 'required|integer|min:0|gte:min_price_order',
                'limit_use' => 'required|integer|min:0',
                'is_active' => 'boolean',
            ], [
                'name.required' => 'Tên phiếu giảm giá là bắt buộc.',
                'name.max' => 'Tên phiếu giảm giá không được vượt quá 50 ký tự.',
                'code.required' => 'Phiếu giảm giá là bắt buộc.',
                'code.max' => 'Phiếu giảm giá không được vượt quá 50 ký tự.',
                'code.unique' => 'Phiếu giảm giá đã tồn tại.',
                'value.required' => 'Giá trị giảm giá là bắt buộc.',
                'value.integer' => 'Giá trị giảm giá phải là số nguyên.',
                'value.min' => 'Giá trị giảm giá không được nhỏ hơn 0.',
                'time_start.required' => 'Thời gian bắt đầu là bắt buộc.',
                'time_start.date' => 'Thời gian bắt đầu không hợp lệ.',
                'time_start.after' => 'Thời gian bắt đầu phải sau thời điểm hiện tại.',
                'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
                'time_end.after_or_equal' => 'Thời gian kết thúc phải bằng hoặc sau thời gian bắt đầu.',
                'min_price_order.required' => 'Giá trị đơn hàng tối thiểu là bắt buộc.',
                'min_price_order.integer' => 'Giá trị đơn hàng tối thiểu phải là số nguyên.',
                'min_price_order.min' => 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',
                'max_price_discount.required' => 'Mức giảm giá tối đa là bắt buộc.',
                'max_price_discount.integer' => 'Mức giảm giá tối đa phải là số nguyên.',
                'max_price_discount.min' => 'Mức giảm giá tối đa không được nhỏ hơn 0.',
                'max_price_discount.gte' => 'Mức giảm giá tối đa phải lớn hơn hoặc bằng giá trị đơn hàng tối thiểu.',
                'limit_use.required' => 'Giới hạn sử dụng là bắt buộc.',
                'limit_use.integer' => 'Giới hạn sử dụng phải là số nguyên.',
                'limit_use.min' => 'Giới hạn sử dụng không được nhỏ hơn 0.',
                'is_active.boolean' => 'Trạng thái hoạt động không hợp lệ.',
            ]);

            if ($validate->fails()) {
                return $this->error('Dữ liệu không hợp lệ', $validate->errors(), 422);
            }

            $coupon = Coupon::create($request->all());

            return $this->success(new CouponResource($coupon), 'Tạo phiếu giảm giá thành công', 201);
        } catch (\Exception $e) {
            return $this->error('Không thể tạo phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $coupon = Coupon::findOrFail($id);

            $validate = Validator::make($request->all(), [
                'name' => 'required|string|max:50',
                'time_end' => 'nullable|date|after_or_equal:time_start',
            ], [
                'name.required' => 'Tên phiếu giảm giá là bắt buộc.',
                'name.max' => 'Tên phiếu giảm giá không được vượt quá 50 ký tự.',
                'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
                'time_end.after_or_equal' => 'Thời gian kết thúc phải bằng hoặc sau thời gian bắt đầu.',
            ]);

            if ($validate->fails()) {
                return $this->error('Dữ liệu không hợp lệ', $validate->errors(), 422);
            }

            $coupon->update($request->all());

            return $this->success(new CouponResource($coupon), 'Cập nhật phiếu giảm giá thành công');
        } catch (\Exception $e) {
            return $this->error('Không thể cập nhật phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        try {

            $coupon = Coupon::findOrFail($id);

            $coupon->delete();//Xóa mềm

            return $this->success(null, 'Xóa phiếu giảm giá thành công');
        } catch (\Exception $e) {
            return $this->error('Không thể xóa phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }
}
