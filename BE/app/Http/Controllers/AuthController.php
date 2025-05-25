<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    use ApiResponse;
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return $this->error('Thông tin đăng nhập không chính xác', [], 401, );
        }

        $user = JWTAuth::user(); // Lấy thông tin user từ JWT

        return $this->success([
            'token' => $token,
            'user' => new UserResource($user),
        ], 'Đăng nhập thành công', 200);
    }

    public function register(Request $request)
    {
        $request->validate([
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|unique:users,phone',
        'name' => 'required|string|max:255',
        'password' => 'required|string|min:6',
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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return $this->success(new UserResource($user), 'Đăng ký thành công', 201);
    }
}
