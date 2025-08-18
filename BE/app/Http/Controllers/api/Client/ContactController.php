<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Client\ContactResource;
use App\Mail\ContactMail;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use App\Rules\Captcha;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // kiểm tra honeypot
        if ($request->filled('website')) {
            return response()->json(['message' => 'Đã phát hiện thư rác'], 422);
        }

        $key = 'contact-form:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 50)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Quá nhiều liên hệ. Vui lòng thử lại sau.',
                'retry_after' => $seconds,
            ], 429);
        }


        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'title' => $request->title,
            'content' => $request->content,
            'is_read' => false,
        ]);


        RateLimiter::hit($key, 3600); // 1h đếm ngược

        Mail::to($request->email)->send(new ContactMail($contact));
        return response()->json([
            'message' => 'Đã gửi email cho khách hàng',
        ], 200);
    }
}
