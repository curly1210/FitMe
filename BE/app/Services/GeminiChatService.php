<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiChatService
{
    protected $apiKey;
    protected $url;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    }

    public function chatWithSession(string $message, ?string $sessionId = null): string
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());

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

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->url . '?key=' . $this->apiKey, [
            'contents' => $contents
        ]);

        if ($response->successful()) {
            $reply = $response->json('candidates.0.content.parts.0.text') ?? 'Không có phản hồi.';

            $history[] = [
                'user' => $message,
                'bot' => $reply,
            ];

            // Chỉ giữ lại 30 lượt chat gần nhất
            $history = array_slice($history, -30);

            session([$sessionKey => $history]);

            return $reply;
        }

        Log::error('Gemini API Error', [
            'status' => $response->status(),
            'url' => $this->url,
            'body' => $response->body(),
        ]);

        return 'Lỗi khi gọi Gemini API.';
    }

    public function resetHistory(?string $sessionId = null): void
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());

        session()->forget($sessionKey);
    }
}
