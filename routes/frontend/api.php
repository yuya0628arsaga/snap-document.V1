<?php

declare(strict_types=1);

use App\Http\Controllers\Frontend\Chat\Api\StoreChatController;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;

/*
|--------------------------------------------------------------------------
| User API Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('chats')->name('chat.')->group(function () {
    Route::post('/', StoreChatController::class)->name('store');
});


Route::get('/test1', function (Request $request) {
    Document::create([
        'name' => 'Man_Digest_v9',
        'extension' => 'pdf',
        'url' => 'https://mel-document-public.s3.ap-northeast-1.amazonaws.com',
    ]);
});
