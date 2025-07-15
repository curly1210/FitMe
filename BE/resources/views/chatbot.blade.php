<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Chatbot Gemini Test</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
        #chat-box { background: #fff; padding: 15px; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .chat-message { margin-bottom: 10px; }
        .user { color: #0d6efd; }
        .bot { color: #198754; }
    </style>
</head>
<body>

<div id="chat-box">
    <h2>💬 Trò chuyện với trợ lý thời trang</h2>

    <div id="messages">
        @if(session('chatbot.history.guest'))
            @foreach(session('chatbot.history.guest') as $entry)
                <div class="chat-message"><strong class="user">Bạn:</strong> {{ $entry['user'] }}</div>
                <div class="chat-message"><strong class="bot">Bot:</strong> {{ $entry['bot'] }}</div>
            @endforeach
        @endif
    </div>

    <form method="POST" action="{{ route('chatbot.test') }}">
        @csrf
        <input type="text" name="message" placeholder="Nhập câu hỏi..." style="width:80%;" required>
        <button type="submit">Gửi</button>
    </form>

    {{-- @if(session('reply'))
        <p><strong>Phản hồi:</strong> {{ session('reply') }}</p>
    @endif --}}

    <form method="POST" action="/chatbot-test/reset" style="margin-top: 10px;">
        @csrf
        <button type="submit">🔁 Xóa lịch sử trò chuyện</button>
    </form>
</div>

</body>
</html>
