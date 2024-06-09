<?php

declare(strict_types=1);

use App\Http\Controllers\Frontend\Auth\GoogleLoginController;
use App\Http\Controllers\Frontend\Auth\LoginController;
use App\Http\Controllers\Frontend\Auth\LogoutController;
use App\Http\Controllers\Frontend\Chat\ChatController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Web Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware(['guest:web'])->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        // デフォルトのログイン
        Route::get('/login', [LoginController::class, 'index'])->name('index');
        Route::post('/login', [LoginController::class, 'login'])->name('login');

        // Googleログイン
        Route::get('/google', [GoogleLoginController::class, 'redirect'])->name('login.google');
        Route::get('/google/callback', [GoogleLoginController::class, 'callback'])->name('login.google.callback');
    });
});

Route::middleware('auth:web')->group(function () {
    Route::get('/auth/logout', LogoutController::class)->name('auth.logout');

    Route::get('/', ChatController::class)->name('home');
});


# テストユーザー登録用
Route::get('/test-register', function () {
    return User::firstOrCreate([
        'email' => 'test@test.com'
    ], ['name' => 'テストユーザー', 'password' => 'test']);
});