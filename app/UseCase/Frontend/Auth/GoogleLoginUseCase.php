<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Auth;

use App\Models\User;
use App\Repositories\Frontend\User\UserRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleLoginUseCase
{
    /**
     * @param UserRepository $userRepository
     */
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {
    }

    /**
     * Googleの認証画面にリダイレクト
     *
     * @return RedirectResponse
     */
    public function redirectToGoogleAuth(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Google認証を許可したユーザーの取得
     *
     * @return User
     */
    public function getGoogleAuthUser(): User
    {
        $socialiteUser = Socialite::driver('google')->user();
        $email = $socialiteUser->getEmail();
        $name = $socialiteUser->getName();
        $avatarUrl = $socialiteUser->getAvatar();

        return DB::transaction(function () use ($email, $name, $avatarUrl) {
            Log::info('[Start] ユーザーの認証処理を開始します。');

            $user = $this->userRepository->updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'avatar_url' => $avatarUrl,
                ],
            );

            Log::info('[end] ユーザーの認証処理が終了しました。', [
                'user' => $user
            ]);

            return $user;
        });
    }
}
