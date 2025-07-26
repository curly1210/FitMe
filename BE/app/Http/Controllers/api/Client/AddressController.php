<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\AddressResource;
use App\Models\ShippingAddress;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AddressController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $addresses = ShippingAddress::where('user_id', $user->id)->get();

            return response()->json(AddressResource::collection($addresses));
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy danh sách địa chỉ', [$th->getMessage()], 403);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $validatedData = $request->validate([
                'name_receive' => 'required|string|max:50',
                // 'phone' => 'required|string|min:10|max:10|unique:shipping_address,phone',
                'phone' => 'required|string|min:10|max:10',
                // 'email' => 'required|email|max:50',
                // 'country' => 'required|string|max:50',
                'province' => 'required|string|max:50',
                'province_id' => 'required|interger|min:0',

                'district' => 'required|string|max:50',
                'district_id' => 'required|interger|min:0',

                'ward' => 'required|string|max:50',
                'ward_code' => 'required|string|max:50',

                'detail_address' => 'required|string|max:50',
                'is_default' => 'boolean|nullable',
            ], [
                'name_receive.required' => 'Tên người nhận là bắt buộc.',
                'name_receive.max' => 'Tên người nhận không được dài quá 50 ký tự.',
                'phone.required' => 'Số điện thoại là bắt buộc.',
                // 'phone.unique' => 'Số điện thoại đã được sử dụng.',
                'phone.min' => 'Số điện thoại phải có ít nhất 10 ký tự.',
                'phone.max' => 'Số điện thoại không được dài quá 10 ký tự.',
                // 'email.required' => 'Email là bắt buộc.',
                // 'email.email' => 'Email không hợp lệ.',
                // 'email.max' => 'Email không được dài quá 50 ký tự.',
                // 'country.required' => 'Quốc gia là bắt buộc.',
                // 'country.max' => 'Quốc gia không được dài quá 50 ký tự.',
                'province.required' => 'Tên tỉnh thành là bắt buộc.',
                'province.max' => 'Tên tỉnh không được dài quá 50 ký tự.',
                'province_id.min' => 'Mã tỉnh phải là số dương',
                'province_id.required' => 'Mã tỉnh là bắt buộc',
                'province_id.interger' => 'Mã tỉnh phải là số nguyên',



                'district.required' => 'Quận/Huyện là bắt buộc.',
                'district.max' => 'Quận/Huyện không được dài quá 50 ký tự.',
                'district_id.min' => 'Mã quận/huyện phải là số dương',
                'district_id.required' => 'Mã quận/huyện là bắt buộc',
                'district_id.interger' => 'Mã quận/huyện phải là số nguyên',



                'ward.required' => 'Phường/Xã là bắt buộc.',
                'ward.max' => 'Phường/Xã không được dài quá 50 ký tự.',
                'ward_code.required' => 'Mã phường/Xã là bắt buộc.',
                'ward_code.max' => 'Mã phường/Xã không được dài quá 50 ký tự.',
                'ward_code.string' => 'Mã phường/Xã phải là kiểu chuỗi',
                'detail_address.required' => 'Địa chỉ chi tiết là bắt buộc.',
                'detail_address.max' => 'Địa chỉ chi tiết không được dài quá 50 ký tự.',
            ]);

            $data = $validatedData;
            $data['user_id'] = $user->id;

            // Kiểm tra số lượng địa chỉ hiện có của người dùng
            $existingAddressesCount = ShippingAddress::where('user_id', $user->id)->count();

            // Nếu danh sách rỗng và không cung cấp is_default, tự động đặt is_default = 1
            if ($existingAddressesCount === 0) {
                $data['is_default'] = 1;
            }

            // Nếu is_default được cung cấp và là true, cập nhật các địa chỉ khác
            if (isset($validatedData['is_default']) && $validatedData['is_default']) {
                ShippingAddress::where('user_id', $user->id)
                    ->where('id', '!=', $data['id'] ?? null)
                    ->update(['is_default' => 0]);
                $data['is_default'] = 1;
            }

            $address = ShippingAddress::create($data);
            return $this->success(new AddressResource($address), 'Địa chỉ nhận hàng đã được thêm thành công.', 201);
        } catch (ValidationException $e) {
            return $this->error('Thông tin nhập vào không hợp lệ. Vui lòng kiểm tra lại.', $e->errors(), 422);
        } catch (\Throwable $th) {
            return $this->error('Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại sau.', ['error' => $th->getMessage()], 403);
        }
    }

    // public function show($id)
    // {
    //     try {
    //         $user = JWTAuth::parseToken()->authenticate();

    //         $address = ShippingAddress::where('user_id', $user->id)->findOrFail($id);
    //         return $this->success(
    //             new AddressResource($address),
    //             'Lấy thông tin địa chỉ nhận hàng thành công.',
    //             200
    //         );
    //     } catch (\Exception $e) {
    //         return $this->error('Không tìm thấy địa chỉ này. Vui lòng kiểm tra lại.', ['error' => $e->getMessage()], 403);
    //     }
    // }

    public function update(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $address = ShippingAddress::where('user_id', $user->id)->findOrFail($id);

            $countAddress = ShippingAddress::where('user_id', $user->id)->count();

            $validatedData = $request->validate([
                'name_receive' => 'required|string|max:50',
                // 'phone' => 'required|string|min:10|max:10|unique:shipping_address,phone',
                'phone' => 'required|string|min:10|max:10',
                // 'email' => 'required|email|max:50',
                // 'country' => 'required|string|max:50',
                'province' => 'required|string|max:50',
                'province_id' => 'required|interger|min:0',

                'district' => 'required|string|max:50',
                'district_id' => 'required|interger|min:0',

                'ward' => 'required|string|max:50',
                'ward_code' => 'required|string|max:50',

                'detail_address' => 'required|string|max:50',
                'is_default' => 'boolean|nullable',
            ], [
                'name_receive.required' => 'Tên người nhận là bắt buộc.',
                'name_receive.max' => 'Tên người nhận không được dài quá 50 ký tự.',
                'phone.required' => 'Số điện thoại là bắt buộc.',
                // 'phone.unique' => 'Số điện thoại đã được sử dụng.',
                'phone.min' => 'Số điện thoại phải có ít nhất 10 ký tự.',
                'phone.max' => 'Số điện thoại không được dài quá 10 ký tự.',
                // 'email.required' => 'Email là bắt buộc.',
                // 'email.email' => 'Email không hợp lệ.',
                // 'email.max' => 'Email không được dài quá 50 ký tự.',
                // 'country.required' => 'Quốc gia là bắt buộc.',
                // 'country.max' => 'Quốc gia không được dài quá 50 ký tự.',
                // 'city.required' => 'Thành phố là bắt buộc.',
                // 'city.max' => 'Thành phố không được dài quá 50 ký tự.',
                'province.required' => 'Tên tỉnh thành là bắt buộc.',
                'province.max' => 'Tên tỉnh không được dài quá 50 ký tự.',
                'province_id.min' => 'Mã tỉnh phải là số dương',
                'province_id.required' => 'Mã tỉnh là bắt buộc',
                'province_id.interger' => 'Mã tỉnh phải là số nguyên',



                'district.required' => 'Quận/Huyện là bắt buộc.',
                'district.max' => 'Quận/Huyện không được dài quá 50 ký tự.',
                'district_id.min' => 'Mã quận/huyện phải là số dương',
                'district_id.required' => 'Mã quận/huyện là bắt buộc',
                'district_id.interger' => 'Mã quận/huyện phải là số nguyên',



                'ward.required' => 'Phường/Xã là bắt buộc.',
                'ward.max' => 'Phường/Xã không được dài quá 50 ký tự.',
                'ward_code.required' => 'Mã phường/Xã là bắt buộc.',
                'ward_code.max' => 'Mã phường/Xã không được dài quá 50 ký tự.',
                'ward_code.string' => 'Mã phường/Xã phải là kiểu chuỗi',
                'detail_address.required' => 'Địa chỉ chi tiết là bắt buộc.',
                'detail_address.max' => 'Địa chỉ chi tiết không được dài quá 50 ký tự.',
            ]);

            $data = $validatedData;

            if ((isset($validatedData['is_default']) && $validatedData['is_default']) || $countAddress == 1) {
                ShippingAddress::where('user_id', $user->id)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
                $data['is_default'] = true;
            } elseif ($address->is_default && !isset($validatedData['is_default'])) {
                // Giữ nguyên is_default nếu không thay đổi
            } else {
                $data['is_default'] = $validatedData['is_default'] ?? false;

                if ($address->is_default && !$data['is_default']) {
                    // Tìm địa chỉ khác (mới nhất hoặc bất kỳ) để set mặc định
                    $otherDefault = ShippingAddress::where('user_id', $user->id)
                        ->where('id', '!=', $id)
                        ->first();

                    if ($otherDefault) {
                        $otherDefault->update(['is_default' => true]);
                    }
                }
            }

            $address->update($data);
            return $this->success(
                new AddressResource($address),
                'Cập nhật địa chỉ nhận hàng thành công.',
                200
            );
        } catch (ValidationException $e) {
            return $this->error('Thông tin nhập vào không hợp lệ. Vui lòng kiểm tra lại.', $e->errors(), 422);
        } catch (\Throwable $th) {
            return $this->error('Có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại sau.', ['error' => $th->getMessage()], 403);
        }
    }
    public function destroy($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $address = ShippingAddress::where('user_id', $user->id)->findOrFail($id);

            if ($address->is_default) {
                return $this->error('Không thể xóa địa chỉ mặc định. Vui lòng chọn một địa chỉ khác làm mặc định trước khi xóa.', [], 400);
            }

            $address->delete();
            return $this->success(null, 'Địa chỉ nhận hàng đã được xóa thành công.', 200);
        } catch (\Exception $e) {
            return $this->error('Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại sau.', ['error' => $e->getMessage()], 403);
        }
    }
}
