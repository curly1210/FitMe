<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Services\GeminiChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatbotController extends Controller
{
    public function chat(Request $request, GeminiChatService $gemini)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $sessionId = $request->session()->getId();

        $message = $request->input('message');
        $reply = $gemini->chatWithSession($message, $sessionId);

        $history = session('chatbot.history.' . $sessionId, []);

        // Nếu đến từ blade view, redirect lại
        if ($request->isMethod('post') && $request->is('chatbot-test')) {
            return back()->with([
            'reply' => $reply,
            'history' => $history,
        ]);
        }

        return response()->json([
            'reply' => $reply,
            'history' => $history,
        ]);
    }

    public function reset(Request $request, GeminiChatService $gemini)
    {
        // $userId = Auth::check() ? Auth::id() : null;
        $sessionId = $request->session()->getId();

        $gemini->resetHistory($sessionId);

        // Nếu từ web, chuyển hướng về lại form
        if ($request->is('chatbot-test/reset')) {
            return redirect()->route('chatbot.test')->with('reply', '🗑️ Đã xóa lịch sử trò chuyện.');
        }
        // Nếu từ API, trả về JSON
        return response()->json([
            'message' => 'Đã xóa lịch sử trò chuyện.',
        ]);
    }
}
