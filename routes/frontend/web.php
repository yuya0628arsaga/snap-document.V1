<?php

declare(strict_types=1);

use App\Http\Controllers\Frontend\Auth\GoogleLoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Web Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:web')->get('/', function () {
    return view('frontend.home.index');
})->name('home');

Route::middleware('guest:web')->get('/login', function () {
    return view('frontend.auth.index');
})->name('auth.index');

Route::middleware('auth:web')->get('/ogawa', function () {
    return view('backend.home.index');
});


Route::get('/auth/google', [GoogleLoginController::class, 'redirect'])->name('login.google');
Route::get('/auth/google/callback', [GoogleLoginController::class, 'callback'])->name('login.google.callback');