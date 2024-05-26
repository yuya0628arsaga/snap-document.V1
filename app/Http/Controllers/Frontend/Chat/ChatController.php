<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Auth\AuthUserGetter;
use Illuminate\View\View;

class ChatController extends Controller
{
    /**
     *
     * @return View
     */
    public function __invoke(): View
    {
        $user = AuthUserGetter::get();
        return view('frontend.home.index')->with([
            'userName' => $user->name,
            'avatarUrl' => $user->avatar_url,
        ]);
    }
}
