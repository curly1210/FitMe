<?php

use App\Http\Controllers\api\Client\ChatbotController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/chatbot-test', function () {
    return view('chatbot');
});

Route::post('/chatbot-test', [ChatbotController::class, 'chat'])->name('chatbot.test');
Route::post('/chatbot-test/reset', [ChatbotController::class, 'reset'])->name('chatbot.reset');