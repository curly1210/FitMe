<?php

namespace App\Http\Controllers\api\Admin;

use Carbon\Carbon;
use App\Models\Coupon;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Admin\CouponResource;


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
                    $q->where('name', 'like', "%{$keyword}%")->orWhere('code', 'like', "%{$keyword}%")
                      ->orWhere('type', 'like', "%{$keyword}%");
                });
            }
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $coupons = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return CouponResource::collection($coupons);
    }

    public function store(Request $request)
    {
        try {
            $validate = Validator::make($request->only(['name', 'type' ,'code', 'value', 'time_start', 'time_end', 'min_price_order', 'max_price_discount', 'limit_use']), [
                'name' => 'required|string|max:50',
                'code' => 'required|string|max:50|unique:coupons,code',
                'type' => 'required|string|in:percentage,fixed', // Loại mã: phần trăm hoặc cố định
                'value' => 'required|integer|min:0',
                'time_start' => 'required|date|after:now',
                'time_end' => 'nullable|date|after:time_start',
                'min_price_order' => 'required|integer|min:0',
                'max_price_discount' => 'required|integer|min:0|lte:min_price_order',
                'limit_use' => 'required|integer|min:0',

            ], [
                'name.required' => 'Tên phiếu giảm giá là bắt buộc.',
                'name.max' => 'Tên phiếu giảm giá không được vượt quá 50 ký tự.',
                'code.required' => 'Phiếu giảm giá là bắt buộc.',
                'code.max' => 'Phiếu giảm giá không được vượt quá 50 ký tự.',
                'code.unique' => 'Phiếu giảm giá đã tồn tại.',
                'type.required' => 'Loại phiếu giảm giá là bắt buộc.',
                'type.in' => 'Loại phiếu giảm giá phải là percentage hoặc fixed.',
                'value.required' => 'Giá trị giảm giá là bắt buộc.',
                'value.integer' => 'Giá trị giảm giá phải là số nguyên.',
                'value.min' => 'Giá trị giảm giá không được nhỏ hơn 0.',
                'time_start.required' => 'Thời gian bắt đầu là bắt buộc.',
                'time_start.date' => 'Thời gian bắt đầu không hợp lệ.',
                'time_start.after' => 'Thời gian bắt đầu phải sau thời điểm hiện tại.',
                'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
                'time_end.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
                'min_price_order.required' => 'Giá trị đơn hàng tối thiểu là bắt buộc.',
                'min_price_order.integer' => 'Giá trị đơn hàng tối thiểu phải là số nguyên.',
                'min_price_order.min' => 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',
                'max_price_discount.required' => 'Mức giảm giá tối đa là bắt buộc.',
                'max_price_discount.integer' => 'Mức giảm giá tối đa phải là số nguyên.',
                'max_price_discount.min' => 'Mức giảm giá tối đa không được nhỏ hơn 0.',
                'max_price_discount.lte' => 'Mức giảm giá tối đa phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu.',
                'limit_use.required' => 'Giới hạn sử dụng là bắt buộc.',
                'limit_use.integer' => 'Giới hạn sử dụng phải là số nguyên.',
                'limit_use.min' => 'Giới hạn sử dụng không được nhỏ hơn 0.',

            ]);

            if ($validate->fails()) {
                return $this->error('Dữ liệu không hợp lệ', $validate->errors(), 422);
            }
            $coupon = Coupon::create([
                'name' => $request->name,
                'code' => $request->code,
                'type' => $request->type,
                'value' => $request->value,
                'time_start' => $request->time_start,
                'time_end' => $request->time_end,
                'min_price_order' => $request->min_price_order,
                'max_price_discount' => $request->max_price_discount,
                'limit_use' => $request->limit_use,
                'is_active' => 1, // Mặc định là hoạt động
            ]);

            return $this->success(new CouponResource($coupon), 'Tạo phiếu giảm giá thành công', 201);
        } catch (\Exception $e) {
            return $this->error('Không thể tạo phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        // $time_end =  $request->time_end;
        // $time_now =  now('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s');
        // return response()->json([
        //     'time_end' => $time_end,
        //     'time_now' => $time_now,
        // ]);
        // return response()->json('time_start' . $request->time_start);
        try {
            $coupon = Coupon::findOrFail($id);

            $validate = Validator::make($request->only(['name', 'type' ,'time_start', 'time_end', 'limit_use']), [
                'name' => 'required|string|max:50',
                'type' => 'required|string|in:percentage,fixed',
                'time_end' => 'nullable|date|after:time_start',
                'limit_use' => 'required|integer|min:0',
            ], [
                'name.required' => 'Tên phiếu giảm giá là bắt buộc.',
                'name.max' => 'Tên phiếu giảm giá không được vượt quá 50 ký tự.',
                'type.required' => 'Loại phiếu giảm giá là bắt buộc.',
                'type.in' => 'Loại phiếu giảm giá phải là percentage hoặc fixed.',
                'time_end.date' => 'Thời gian kết thúc không hợp lệ.',
                'time_end.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',



                'limit_use.required' => 'Giới hạn sử dụng là bắt buộc.',
                'limit_use.integer' => 'Giới hạn sử dụng phải là số nguyên.',
                'limit_use.min' => 'Giới hạn sử dụng không được nhỏ hơn 0.',
            ]);
            $errors = $validate->errors();
            if ($request->has('time_end') && !$errors->has('time_end')) {
                $validate->after(function ($validator) use ($request) {
                    $timeEnd =  Carbon::parse($request->time_end, 'Asia/Ho_Chi_Minh');
                    $now =  now('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s');
                    if ($request->time_end && $timeEnd->lt($now)) {

                        $validator->errors()->add('time_end', 'Thời gian kết thúc phải bằng hoặc sau thời gian hiện tại.');
                    }
                });
            }
            if ($validate->fails()) {

                return $this->error('Dữ liệu không hợp lệ', $validate->errors(), 422);
            }
            $data = [
                'name' => $request->name,
                'type' => $request->type,
                'time_end' => $request->time_end,
                'limit_use' => $request->limit_use,
            ];
            $coupon->update($data);

            return $this->success(new CouponResource($coupon), 'Cập nhật phiếu giảm giá thành công');
        } catch (\Exception $e) {
            return $this->error('Không thể cập nhật phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        try {
            DB::beginTransaction();

            $coupon = Coupon::findOrFail($id);

            $coupon->update(['is_active' => 0]);

            $coupon->delete(); //Xóa mềm

            DB::commit();

            return $this->success(null, 'Xóa phiếu giảm giá thành công');
        } catch (\Exception $e) {
            return $this->error('Không thể xóa phiếu giảm giá', ['error' => $e->getMessage()], 500);
        }
    }
}
