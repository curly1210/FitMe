<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Services\GeminiChatService;
use Illuminate\Http\Request;

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

        return response()->json([
            'reply' => $reply,
            'history' => session('chatbot.history.' . $sessionId, []),
        ]);
    }

    public function reset(Request $request, GeminiChatService $gemini)
    {
        $sessionId = $request->session()->getId();
        $gemini->resetHistory($sessionId);

        return response()->json([
            'message' => 'Đã xóa lịch sử trò chuyện.',
        ]);
    }
}
