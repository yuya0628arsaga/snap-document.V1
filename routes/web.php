<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// デプロイテスト用
Route::get('/welcome', function () {
    Log::debug('/welcome にアクセス');
    return view('welcome', [
        "message" => "メッセージ",
    ]);
});

Route::get('/', function () {
    // Log::debug('/ にアクセス');
    return view('welcome', [
        "message" => "ルート /",
    ]);
});

Route::get('/test', function () {
    Log::debug('/test にアクセス');
    return view('frontend.home.index');
});

Route::get('/test/gpt', function () {
    Log::debug('/test/gpt にアクセス');
    $resp = Http::get(config('api.gpt_engine.endpoint').'/hello');
    $resp = $resp->json();
    Log::debug($resp);
    return view('welcome', [
        'message' => $resp['message']
    ]);
});

Route::get('/test/gpt3', function () {
    Log::debug('/test/gpt3 にアクセス');
    Log::debug('アクセス先：'.config('api.gpt_engine.endpoint').'/test3');

    $resp = Http::timeout(-1)->withHeaders([
        'Content-Type' => 'application/json',
    ])->post(config('api.gpt_engine.endpoint').'/test3', [
        'question' => 'sample質問',
        'document_name' => 'sampleドキュメント',
        'chat_history' => [],
    ]);
    $resp = $resp->json();
    Log::debug($resp);
    return view('welcome', [
        'message' => $resp['answer']
    ]);
});
