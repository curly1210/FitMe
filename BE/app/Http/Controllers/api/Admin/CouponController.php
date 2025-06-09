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
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $coupons = $query->paginate($perPage);

        return CouponResource::collection($coupons);
    }

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:20|unique:coupons',
            'value' => 'required|integer|min:0',
            'time_start' => 'required|date|after:now',
            'time_end' => 'required|date|after:time_start',
            'min_amount' => 'required|integer|min:0',
            'max_amount' => 'required|integer|min:0',
            'limit_use' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ],[
            'name.required' => 'Tên mã giảm giá là bắt buộc.',
            'name.max' => 'Tên mã giảm giá không được vượt quá 50 ký tự.',
            'code.required' => 'Mã giảm giá là bắt buộc.',
            'code.max' => 'Mã giảm giá không được vượt quá 20 ký tự.',
            'code.unique' => 'Mã giảm giá đã tồn tại.',
            'value.required' => 'Giá trị giảm giá là bắt buộc.',
            'value.integer' => 'Giá trị giảm giá phải là số nguyên.',
            'value.min' => 'Giá trị giảm giá không được nhỏ hơn 0.',
            'time_start.required' => 'Thời gian bắt đầu là bắt buộc.',
            'time_start.date' => 'Thời gian bắt đầu không hợp lệ.',
            'time_start.after' => 'Thời gian bắt đầu phải sau thời điểm hiện tại.',
            'time_end.required' => 'Thời gian kết thúc là bắt buộc.',
            'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
            'time_end.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'min_amount.required' => 'Số tiền tối thiểu là bắt buộc.',
            'min_amount.integer' => 'Số tiền tối thiểu phải là số nguyên.',
            'min_amount.min' => 'Số tiền tối thiểu không được nhỏ hơn 0.',
            'max_amount.required' => 'Số tiền tối đa là bắt buộc.',
            'max_amount.integer' => 'Số tiền tối đa phải là số nguyên.',
            'max_amount.min' => 'Số tiền tối đa không được nhỏ hơn 0.',
            'limit_use.required' => 'Giới hạn sử dụng là bắt buộc.',
            'limit_use.integer' => 'Giới hạn sử dụng phải là số nguyên.',
            'limit_use.min' => 'Giới hạn sử dụng không được nhỏ hơn 0.',
            'is_active.boolean' => 'Trạng thái hoạt động không hợp lệ.',
        ]);

        if($validate->fails())
        {
            return $this->error('Dữ liệu không hợp lệ',$validate->errors(),422);
        }

        $coupon = Coupon::create($request->all());

        return $this->success(new CouponResource($coupon),'Tạo mã giảm giá thành công',201);
    }
    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('coupons')->ignore($coupon->id),
            ],
            'value' => 'required|integer|min:0',
            'time_start' => 'required|date|after:now',
            'time_end' => 'required|date|after:time_start',
            'min_amount' => 'required|integer|min:0',
            'max_amount' => 'required|integer|min:0',
            'limit_use' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên mã giảm giá là bắt buộc.',
            'name.max' => 'Tên mã giảm giá không được vượt quá 50 ký tự.',
            'code.required' => 'Mã giảm giá là bắt buộc.',
            'code.max' => 'Mã giảm giá không được vượt quá 20 ký tự.',
            'code.unique' => 'Mã giảm giá đã tồn tại.',
            'value.required' => 'Giá trị giảm giá là bắt buộc.',
            'value.integer' => 'Giá trị giảm giá phải là số nguyên.',
            'value.min' => 'Giá trị giảm giá không được nhỏ hơn 0.',
            'time_start.required' => 'Thời gian bắt đầu là bắt buộc.',
            'time_start.date' => 'Thời gian bắt đầu không hợp lệ.',
            'time_start.after' => 'Thời gian bắt đầu phải sau thời điểm hiện tại.',
            'time_end.required' => 'Thời gian kết thúc là bắt buộc.',
            'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
            'time_end.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'min_amount.required' => 'Số tiền tối thiểu là bắt buộc.',
            'min_amount.integer' => 'Số tiền tối thiểu phải là số nguyên.',
            'min_amount.min' => 'Số tiền tối thiểu không được nhỏ hơn 0.',
            'max_amount.required' => 'Số tiền tối đa là bắt buộc.',
            'max_amount.integer' => 'Số tiền tối đa phải là số nguyên.',
            'max_amount.min' => 'Số tiền tối đa không được nhỏ hơn 0.',
            'limit_use.required' => 'Giới hạn sử dụng là bắt buộc.',
            'limit_use.integer' => 'Giới hạn sử dụng phải là số nguyên.',
            'limit_use.min' => 'Giới hạn sử dụng không được nhỏ hơn 0.',
            'is_active.boolean' => 'Trạng thái hoạt động không hợp lệ.',
        ]);

        if ($validator->fails()) {
            return $this->error('Dữ liệu không hợp lệ', $validator->errors(), 422);
        }

        $coupon->update($request->all());

        return $this->success(new CouponResource($coupon), 'Cập nhật mã giảm giá thành công');
    }

    public function delete($id)
    {
        try {

            $coupon = Coupon::findOrFail($id);

            $coupon->delete();
            
            return $this->success(null, 'Xóa mã giảm giá thành công');
        } catch (\Exception $e) {
            return $this->error('Không thể xóa mã giảm giá', ['error' => $e->getMessage()], 500);
        }
    }
}
