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