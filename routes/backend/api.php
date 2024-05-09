<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

Route::post('/chroma', function (Request $request) {
    $documentName = $request->input('documentName');

    $res = Http::timeout(-1)->withHeaders([
        'Content-Type' => 'application/json',
    ])->post(config('api.gpt_engine.endpoint').'/chroma', [
        'document_name' => $documentName,
    ]);

    return response()->json([
        'status' => $res['status'],
        'message' => $res['message']
    ], 200);
});