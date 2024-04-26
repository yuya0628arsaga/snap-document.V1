<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| User Web Routes
|--------------------------------------------------------------------------
|
*/

Route::get('/', function () {
    // $resp = Http::get('http://gpt_engine:8000/hello');
    // $resp = $resp->json();
    // Log::debug($resp);
    return view('frontend.home.index');
});

Route::get('/test/gpt', function () {
    Log::debug('サブドメイン（user）で /test/gpt にアクセス');
    Log::debug('アクセス先：'.config('api.gpt_engine.endpoint').'/hello');

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