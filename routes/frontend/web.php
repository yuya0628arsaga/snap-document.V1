<?php

declare(strict_types=1);

use App\Http\Controllers\Frontend\Auth\GoogleLoginController;
use App\Http\Controllers\Frontend\Auth\LoginController;
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
    Route::get('/', ChatController::class)->name('home');
});




Route::middleware('auth:web')->get('/ogawa', function () {
    return view('backend.home.index');
})->name('ogawa');

Route::middleware('auth:web')->get('/ogawa2', function () {
    return view('welcome');
})->name('ogawa2');

Route::get('/test-regi', function () {
    return User::firstOrCreate([
        'email' => 'test@test.com'
    ], ['name' => 'テスト', 'password' => 'test']);
});