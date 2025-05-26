<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    use ApiResponse;
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$accessToken = JWTAuth::attempt($credentials)) {
            return $this->error('Thông tin đăng nhập không chính xác', [], 401,);
        }

        $user = JWTAuth::user(); // Lấy thông tin user từ JWT
        // $refreshTtl = (int) config('jwt.refresh_ttl', 20160); // Thời gian sống của refresh token (mặc định là 20160 phút = 14 ngày)
        $refreshToken = JWTAuth::claims(['type' => 'refresh'])->fromUser($user); // Sử dụng TTL từ config/jwt.php

        return $this->success([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // Tính bằng giây
            'user' => new UserResource($user),
        ], 'Đăng nhập thành công', 200)->cookie(
            'refresh_token',
            $refreshToken,
            // $refreshTtl,
            (int) config('jwt.refresh_ttl'), // Thời gian sống của cookie (phút)
            '/',
            null,
            false, // Secure
            true, // HttpOnly
            false, // Raw
            'Lax' // SameSite
        );
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|unique:users,phone',
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'avatar' => 'nullable|string',
            ], [
                'email.unique' => 'Email đã được sử dụng.',
                'phone.unique' => 'Số điện thoại đã được sử dụng.',
                'email.required' => 'Email là bắt buộc.',
                'email.email' => 'Email không hợp lệ.',
                'phone.required' => 'Số điện thoại là bắt buộc.',
                'name.required' => 'Tên là bắt buộc.',
                'password.required' => 'Mật khẩu là bắt buộc.',
                'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            ]);
        } catch (ValidationException $e) {
            return $this->error('Có lỗi xảy ra khi xác thực dữ liệu', $e->errors(), 422);
        }

        // $request->validate([
        //     'email' => 'required|email|unique:users,email',
        //     'phone' => 'required|unique:users,phone',
        //     'name' => 'required|string|max:255',
        //     'password' => 'required|string|min:6',
        //     'avatar' => 'nullable|string',
        // ], [
        //     'email.unique' => 'Email đã được sử dụng.',
        //     'phone.unique' => 'Số điện thoại đã được sử dụng.',
        //     'email.required' => 'Email là bắt buộc.',
        //     'email.email' => 'Email không hợp lệ.',
        //     'phone.required' => 'Số điện thoại là bắt buộc.',
        //     'name.required' => 'Tên là bắt buộc.',
        //     'password.required' => 'Mật khẩu là bắt buộc.',
        //     'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        // ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return $this->success(new UserResource($user), 'Đăng ký thành công', 201);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return $this->error('Không tìm thấy refresh token', [], 401);
        }

        try {
            JWTAuth::setToken($refreshToken);
            $payload = JWTAuth::getPayload();

            if ($payload->get('type') !== 'refresh') {
                return $this->error('Loại token không hợp lệ', [], 401);
            }

            $user = JWTAuth::toUser($refreshToken);
            $newAccessToken = JWTAuth::fromUser($user);

            return $this->success([
                'access_token' => $newAccessToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60, // Tính bằng giây
                'user' => new UserResource($user),
            ], 'Làm mới token thành công', 200);
        } catch (\Exception $e) {
            return $this->error('Refresh token không hợp lệ', [], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Exception $e) {
            // Không làm gì nếu token không hợp lệ
        }

        return $this->success([], 'Đăng xuất thành công', 200)->cookie(
            'refresh_token',
            '',
            -1, // Xóa cookie
            '/',
            null,
            false, // Secure
            true, // HttpOnly
            false, // Raw
            'Lax' // SameSite
        );
    }
}
