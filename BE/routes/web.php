<?php

use App\Http\Controllers\api\Client\ChatbotController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/chatbot-test', 'chatbot')->name('chatbot.test');
Route::post('/chatbot-test', [ChatbotController::class, 'chat'])->name('chatbot.chat');
Route::post('/chatbot-test/reset', [ChatbotController::class, 'reset'])->name('chatbot.reset');

// Route::post('/chatbot', [ChatbotController::class, 'chat']);
