<?php

namespace App\Http\Controllers\Frontend\Auth;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class GoogleLoginController extends Controller
{
    /**
     * プロバイダにリダイレクト（認証画面の表示）
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * 認証後ログイン状態にする
     *
     * @return RedirectResponse
     */
    public function callback(): RedirectResponse
    {
        $socialiteUser = Socialite::driver('google')->user();
        $email = $socialiteUser->email;

        $user = User::firstOrCreate(['email' => $email], [
            'name' => $socialiteUser->name,
        ]);

        Auth::guard('web')->login($user);

        return redirect()->intended(route('user.home'));
    }
}