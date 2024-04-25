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

Route::get('/test', function () {
    Log::debug('/test にアクセス');
    return view('frontend.home.index');
});

Route::get('/test/gpt', function () {
    Log::debug('/test/gpt にアクセス');
    $resp = Http::get('http://gpt_engine:8000/hello');
    $resp = $resp->json();
    Log::debug($resp);
    return view('welcome', [
        'message' => $resp['message']
    ]);
});
