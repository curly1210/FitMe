<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use ApiResponse;
    use CloudinaryTrait;

    public function showInfo()
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            if (!$user) {
                return $this->error('Bạn chưa đăng nhập', 401);
            }

            return new UserResource($user);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy thông tin tài khoản', $th->getMessage(), 500);
        }
    }

    public function updateInfoBasic(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            if (!$user) {
                return $this->error('Bạn chưa đăng nhập', 401);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'birthday' => 'nullable|date|before:today',
                'phone' => ['nullable', 'string', 'regex:/^([0-9]{10,11})$/', 'unique:users,phone,' . $user->id],
                'gender' => 'nullable',
            ]);

            if ($validator->fails()) {
                return $this->error('Dữ liệu không hợp lệ.', $validator->errors(), 422);
            }

            DB::beginTransaction();

            $data = [];
            if ($request->filled('name')) {
                $data['name'] = $request->input('name');
            }
            if ($request->filled('birthday')) {
                $data['birthday'] = $request->input('birthday');
            }
            if ($request->filled('phone')) {
                $data['phone'] = $request->input('phone');
            }
            if ($request->filled('gender')) {
                $data['gender'] = $request->input('gender');
            }

            if ($request->hasFile('avatar')) {
                if ($user->avatar) {
                    $this->deleteImageFromCloudinary($user->avatar);
                }
                $uploadResult = $this->uploadImageToCloudinary($request->file('avatar'), [
                    'width' => 300,
                    'height' => 300,
                    'quality' => 80,
                    'folder' => 'avatars',
                ]);
                $data['avatar'] = $uploadResult['public_id'];
            }

            $user->update($data);
            DB::commit();

            return $this->success(null, 'Cập nhật thông tin tài khoản thành công', 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error('Lỗi khi cập nhật thông tin tài khoản', $th->getMessage(), 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            if (!$user) {
                return $this->error('Bạn chưa đăng nhập.', null, 401);
            }
            // Kiểm tra mật khẩu cũ
            if (!Hash::check($request->input('old_password'), $user->password)) {
                return $this->error('Mật khẩu cũ không đúng.', null, 422);
            }

            // Validate dữ liệu đầu vào
            $validator = Validator::make($request->all(), [
                'old_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ], [
                'old_password.required' => 'Mật khẩu cũ là bắt buộc.',
                'new_password.required' => 'Mật khẩu mới là bắt buộc.',
                'new_password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
                'new_password.confirmed' => 'Xác nhận mật khẩu mới không khớp.',
            ]);

            if ($validator->fails()) {
                return $this->error('Dữ liệu không hợp lệ.', $validator->errors(), 422);
            }

            DB::beginTransaction();

            // Cập nhật mật khẩu mới
            $user->password = Hash::make($request->input('new_password'));
            $user->save();

            DB::commit();

            return $this->success(null, 'Cập nhật mật khẩu thành công.', 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error('Lỗi khi cập nhật mật khẩu', $e->getMessage(), 500);
        }
    }
}
