<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class ChatController extends Controller
{
    /**
     *
     * @return View
     */
    public function __invoke(): View
    {
        return view('frontend.home.index');
    }
}
