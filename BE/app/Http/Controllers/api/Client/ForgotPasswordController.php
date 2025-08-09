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

        PasswordReset::where('user_id', $user->id)->delete();

        $rawToken = Str::random(60) . $user->id;
        $hashedToken = hash('sha256', $rawToken);

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => $hashedToken,
            'expires_at' => now()->addMinutes(15),
        ]);

        $resetUrl = 'http://localhost:5173/change-password?token=' . $rawToken ;
         // thay đổi đường dẫn từ ? đổ về trước
        Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));

        return response()->json(['message' => 'Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra email.']);
    }








    public function verifyToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $hashedToken = hash('sha256', $request->token);

        $reset = PasswordReset::where('token', $hashedToken)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$reset) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 400);
        }

        return response()->json([
            'valid' => true,
            'user_id' => $reset->user_id
        ]);
    }



    public function resetPassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'password' => 'required|confirmed|min:6',
        ], [
            'user_id.required' => 'Thiếu user_id.',
            'user_id.exists' => 'Người dùng không tồn tại.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.confirmed' => 'Mật khẩu nhập lại không khớp.',
            'password.min' => 'Mật khẩu tối thiểu 6 ký tự.',
        ]);

        $user = User::find($request->user_id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Mật khẩu đã được cập nhật.'
        ]);
    }




}
