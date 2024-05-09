<?php

declare(strict_types=1);

use App\Http\Controllers\Backend\Chroma\StoreChromaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Chroma にベクトルデータを保存する
Route::post('/chroma', StoreChromaController::class)->name('chroma');