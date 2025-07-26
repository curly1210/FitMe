<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Chatbot</title>
    <style>
        .chat-box { width: 400px; border: 1px solid #ccc; padding: 10px; height: 400px; overflow-y: scroll; }
        .user { color: blue; margin: 5px 0; }
        .bot { color: green; margin: 5px 0; }
    </style>
</head>
<body>
    <h2>💬 Chatbot test</h2>

    <div class="chat-box">
        @php
            $history = session('history', []);
        @endphp

        @foreach($history as $chat)
            <div class="user"><strong>Bạn:</strong> {{ $chat['user'] }}</div>
            <div class="bot"><strong>Bot:</strong> {{ $chat['bot'] }}</div>
        @endforeach

        @if(session('reply') && empty($history))
            <div class="bot"><strong>Bot:</strong> {{ session('reply') }}</div>
        @endif
    </div>

    <form action="{{ route('chatbot.chat') }}" method="POST" style="margin-top:10px;">
        @csrf
        <input type="text" name="message" placeholder="Nhập câu hỏi..." required>
        <button type="submit">Gửi</button>
    </form>

    <form action="{{ route('chatbot.reset') }}" method="POST" style="margin-top:10px;">
        @csrf
        <button type="submit">🗑 Reset Chat</button>
    </form>
</body>
</html>
