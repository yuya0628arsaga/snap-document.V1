<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function (Request $request) {
    $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');
    Log::debug($res->json());
    return $res;
    // $resp = $resp->json();
    // Log::debug($resp->json());

    // $resp = ["message" => 9999];
    // $json = json_encode($resp, JSON_PRETTY_PRINT);
    // Log::debug($resp);
    // return response()->json($resp);
    // return response()->json(1111);
});
