<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Mail\ResetPasswordMail;

class ForgotPasswordController extends Controller
{

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
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


}
