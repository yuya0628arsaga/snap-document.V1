<?php

declare(strict_types=1);

namespace App\Services\Frontend\Auth;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

class AuthUserGetter
{
    /**
     * @throws AuthenticationException
     *
     * @return User
     */
    public static function get(): User
    {
        $user = Auth::guard('web')->user();

        if ($user === null) {
            throw new AuthenticationException();
        }

        /* @var User $user */
        return $user;
    }
}