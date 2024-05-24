<?php

namespace App\Http\Controllers\Frontend\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\UseCase\Frontend\Auth\GoogleLoginUseCase;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class GoogleLoginController extends Controller
{
    /**
     * @param GoogleLoginUseCase $googleLoginUseCase
     */
    public function __construct(
        private readonly GoogleLoginUseCase $googleLoginUseCase
    ){
    }

    /**
     * プロバイダにリダイレクト（認証画面の表示）
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return $this->googleLoginUseCase->redirectToGoogleAuth();
    }

    /**
     * 認証後ログイン状態にする
     *
     * @return RedirectResponse
     */
    public function callback(): RedirectResponse
    {
        try {
            $user = $this->googleLoginUseCase->getGoogleAuthUser();
            Auth::guard('web')->login($user);

            return redirect()->intended(route('user.home'));
        } catch (Exception $e) {
            Log::info('ユーザーの認証処理が失敗しました。', [
                'method' => __METHOD__,
                'error' => $e,
            ]);

            return redirect(route('user.auth.index'));
        }
    }
}