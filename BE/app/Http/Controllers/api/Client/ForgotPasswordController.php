<?php

namespace App\Http\Controllers\Api\Client;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PasswordReset;
use Illuminate\Support\Carbon;
use App\Mail\ResetPasswordMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{

    public function sendResetLinkByEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ], [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại.'], 404);
        }

        $token = Str::random(6);
        PasswordReset::where('user_id', $user->id)->delete(); // xóa token cũ

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'created_at' => now(),
            'expires_at' => now()->addMinutes(15),
        ]);

        $resetLink = $token;

        Mail::to($user->email)->send(new ResetPasswordMail($resetLink));

        return response()->json(['message' => 'Đã gửi mã vui lòng kiểm tra email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|confirmed|min:6',
        ], [
            'token.required' => 'Token là bắt buộc.',
            'token.string' => 'Token phải là chuỗi.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
        ]);


        $hashedToken = hash('sha256', $request->token);

        $reset = PasswordReset::where('token', $hashedToken)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$reset) {
            return response()->json(['message' => 'Mã không hợp lệ hoặc đã hết hạn.'], 400);
        }

        $user = User::find($reset->user_id);
        $user->password = Hash::make($request->password);
        $user->save();

        $reset->used = true;
        $reset->save();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật.']);
    }

    public function sendResetLinkByPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
        ], [
            'current_password.required' => 'Mật khẩu hiện tại là bắt buộc.',
            'current_password.string' => 'Mật khẩu hiện tại phải là chuỗi.',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu hiện tại không đúng.'], 401);
        }

        // Xóa các token cũ
        PasswordReset::where('user_id', $user->id)->delete();

        $token = Str::random(6);

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'created_at' => now(),
            'expires_at' => now()->addMinutes(15),
        ]);

        // Gửi mail
        Mail::to($user->email)->send(new ResetPasswordMail($token));

        return response()->json([
            'message' => 'Đã gửi mã xác thực đến email của bạn. Vui lòng kiểm tra hộp thư.'
        ]);
    }


}
