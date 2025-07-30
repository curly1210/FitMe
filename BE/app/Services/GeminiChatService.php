<?php

namespace App\Services;

use App\Models\Product;
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

            return $reply;
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

        // 3. Lấy dữ liệu sản phẩm từ API nội bộ
        $products = Product::with(['productItems.size', 'productItems.color', 'category'])
            ->where('is_active', 1)
            ->get();

        $productsData = $products->map(function ($product) {
            $productItems = $product->productItems ?? collect();

            return [
                "name"         => $product->name,
                "category"     => $product->category->name ?? null,
                "sizes"        => $productItems->pluck('size.name')
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray(),
                "colors"       => $productItems->pluck('color.name')
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray(),
                "price"        => $productItems->min('price'),
                "sale_price"   => $productItems->min('sale_price'),
                "sale_percent" => $productItems->first()->sale_percent ?? 0,
                "stock"        => $productItems->where('stock', '>', 0)->count() > 0
                    ? "Còn hàng"
                    : "Hết hàng",
                "description"  => $product->description,
            ];
        });

        // 4. Prompt gửi cho Gemini
        $basePrompt = <<<EOD
Bạn là một stylist chuyên nghiệp, đang hỗ trợ khách hàng tại website bán quần áo.

Hướng dẫn:
1. Trả lời bằng chính ngôn ngữ mà khách hàng sử dụng.
2. Phong cách: thân thiện, dễ hiểu, chuyên nghiệp.
3. Trả lời ngắn gọn (tối đa 2-3 câu), nhưng đủ ý.
4. Khi khách hỏi về sản phẩm, có thể trích xuất thông tin từ danh mục dưới đây.
5. Nếu khách hỏi về size hoặc màu, trả lời dựa trên dữ liệu thực tế.
6. Không lặp lại lời chào trong nhiều phản hồi.
7. Có thể trả về link ảnh sản phẩm nếu cần.
8. Dữ liệu sản phẩm hiện có:

{$productsData->toJson(JSON_UNESCAPED_UNICODE)}
EOD;

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $basePrompt . "\n\nKhách hàng hỏi: " . $message]],
        ];

        // 5. Gọi API Gemini
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->url . '?key=' . $this->apiKey, [
            'contents' => $contents
        ]);

        // 6. Xử lý phản hồi
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
