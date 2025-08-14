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
    protected $cacheTTL = 604800; // 7 ngày

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    public function chatWithSession(string $message, ?string $sessionId = null): string
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());

        // Lấy lịch sử trước đó
        $history = session($sessionKey, []);

        // Chuẩn bị dữ liệu sản phẩm
        $products = Product::with(['productItems.size', 'productItems.color', 'category'])
            ->where('is_active', 1)
            ->get();

        $productsData = $products->map(function ($product) {
            $productItems = $product->productItems ?? collect();
            return [
                "name"         => $product->name,
                "category"     => $product->category->name ?? null,
                "sizes"        => $productItems->pluck('size.name')->filter()->unique()->values()->toArray(),
                "colors"       => $productItems->pluck('color.name')->filter()->unique()->values()->toArray(),
                "price"        => $productItems->min('price'),
                "sale_price"   => $productItems->min('sale_price'),
                "sale_percent" => $productItems->first()->sale_percent ?? 0,
                "stock"        => $productItems->where('stock', '>', 0)->count() > 0 ? "Còn hàng" : "Hết hàng",
                "description"  => $product->description,
            ];
        });

        // Lời nhắc hệ thống
        $systemPrompt = <<<EOD
Bạn là một stylist chuyên nghiệp, đang hỗ trợ khách hàng tại website bán quần áo.

Hướng dẫn:
1. Trả lời bằng chính ngôn ngữ khách hàng dùng.
2. Phong cách: thân thiện, chuyên nghiệp.
3. Ngắn gọn (2-3 câu) nhưng đầy đủ ý.
4. Khi khách hỏi về sản phẩm, sử dụng dữ liệu dưới đây.
5. Nếu khách hỏi size/màu, trả lời chính xác dựa trên dữ liệu sản phẩm dưới đây.
6. Chỉ chào khách hàng một lần duy nhất trong cuộc hội thoại.
7. Dữ liệu sản phẩm:
{$productsData->toJson(JSON_UNESCAPED_UNICODE)}
EOD;

        // Tạo contents theo format hội thoại nhiều lượt
        $contents = [
            [
                'role' => 'user',
                'parts' => [['text' => $systemPrompt]],
            ]
        ];

        // Gắn lại toàn bộ lịch sử cũ
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

        // Thêm câu hỏi mới của khách
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]],
        ];

        // Gọi API Gemini
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->url . '?key=' . $this->apiKey, [
            'contents' => $contents
        ]);

        if ($response->successful()) {
            $reply = $response->json('candidates.0.content.parts.0.text') ?? 'Không có phản hồi.';

            // Lưu vào session history (tối đa 20 tin)
            $history[] = ['user' => $message, 'bot' => $reply];
            $history = array_slice($history, -20);
            session([$sessionKey => $history]);

            return $reply;
        }

        Log::error('Gemini API Error', [
            'status' => $response->status(),
            'url' => $this->url,
            'body' => $response->body(),
        ]);

        return 'Lỗi khi gọi Gemini API. Vui lòng thử lại sau.';
    }

    public function resetHistory(?string $sessionId = null): void
    {
        $sessionKey = 'chatbot.history.' . ($sessionId ?? session()->getId());
        session()->forget($sessionKey);
    }
}
