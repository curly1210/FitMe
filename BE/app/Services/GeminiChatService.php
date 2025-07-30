<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class GeminiChatService
{
    protected $apiKey;
    protected $url;
    protected $cacheTTL = 7 * 24 * 60 * 60; // Cache 7 ngày

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    public function chatWithSession(string $message, ?string $sessionId = null): string
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());

        // 1. Kiểm tra cache trước
        $cacheKey = 'chatbot.cache.' . md5($message);
        if (Cache::has($cacheKey)) {
            Log::info("Cache hit cho câu hỏi: $message");
            $reply = Cache::get($cacheKey);

            // Lưu lịch sử vào session để hiển thị chat
            $this->saveToHistory($sessionKey, $message, $reply);

            return $reply . " (trả lời từ cache)";
        }

        // 2. Lấy lịch sử chat
        $history = session($sessionKey, []);
        $contents = [];
        foreach ($history as $entry) {
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $entry['user']]],
            ];
            $contents[] = [
                'role' => 'model',
                'parts' => [['text' => $entry['bot']]],
            ];
        }

        // 3. Prompt cố định
        $basePrompt = <<<EOD
Bạn là một stylist chuyên nghiệp, đang hỗ trợ khách hàng tại website bán quần áo.
- Trả lời bằng chính ngôn ngữ mà khách hàng sử dụng
- Phong cách: thân thiện, dễ hiểu, chuyên nghiệp
- Trả lời ngắn gọn (tối đa 2-3 câu), nhưng đủ ý
- Luôn đưa ra lời khuyên rõ ràng, dễ thực hiện
- Nếu khách hỏi về phối đồ, hãy đưa ra ít nhất 1 gợi ý cụ thể (màu sắc, loại trang phục, có thể bảo khách hàng đưa thêm thông tin như chiều cao, cân nặng để tư vấn size cho khách)
- Nếu không rõ yêu cầu, hãy hỏi lại để làm rõ
EOD;

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $basePrompt . "\n\nKhách hàng hỏi: " . $message]],
        ];

        // 4. Gọi API Gemini
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->url . '?key=' . $this->apiKey, [
            'contents' => $contents
        ]);

        // 5. Xử lý phản hồi
        if ($response->successful()) {
            $reply = $response->json('candidates.0.content.parts.0.text') ?? 'Không có phản hồi.';

            // 6. Lưu cache
            Cache::put($cacheKey, $reply, $this->cacheTTL);
            Log::info("Cache lưu câu hỏi: $message");

            // 7. Lưu vào session history
            $this->saveToHistory($sessionKey, $message, $reply);

            return $reply;
        }

        // 8. Log lỗi nếu API fail
        Log::error('Gemini API Error', [
            'status' => $response->status(),
            'url' => $this->url,
            'body' => $response->body(),
        ]);

        return 'Lỗi khi gọi Gemini API. Vui lòng thử lại sau.';
    }

    // Hàm lưu lịch sử chat (giữ 30 tin gần nhất)
    private function saveToHistory(string $sessionKey, string $userMessage, string $botReply): void
    {
        $history = session($sessionKey, []);
        $history[] = [
            'user' => $userMessage,
            'bot' => $botReply,
        ];
        $history = array_slice($history, -20);
        session([$sessionKey => $history]);
    }

    // Reset chat history
    public function resetHistory(?string $sessionId = null): void
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());
        session()->forget($sessionKey);
    }
}
