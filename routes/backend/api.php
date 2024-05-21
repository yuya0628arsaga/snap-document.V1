<?php

declare(strict_types=1);

use App\Http\Controllers\Backend\Chroma\StoreChromaController;
use App\Http\Controllers\Backend\Document\Api\GenerateImageUploadPresignedUrlController;
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

Route::prefix('document')->name('document.')->group(function () {
    Route::post('image/presigned-url', GenerateImageUploadPresignedUrlController::class)->name('image.presigned-url');
});