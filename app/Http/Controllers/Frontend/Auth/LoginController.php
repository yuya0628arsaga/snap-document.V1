<?php

namespace App\Http\Controllers\Frontend\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Session;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class LoginController extends Controller
{
    /**
     * ログイン画面
     *
     * @return View
     */
    public function index(): View
    {
        return view('frontend.auth.index');
    }

    /**
     * ログイン処理
     *
     * @param LoginRequest $request
     *
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only(['email', 'password']);

        if (Auth::guard('web')->attempt($credentials)) {
            $request->session()->regenerate();
            $intendedUrl = $this->getIntendedUrl();

            // ログイン成功
            return response()->json([
                'intendedUrl' => $intendedUrl
            ], SymfonyResponse::HTTP_OK);
        }

        // ログイン失敗
        return response()->json([
            'status' => SymfonyResponse::HTTP_UNAUTHORIZED,
            'message' => __('auth.failed'),
        ], SymfonyResponse::HTTP_UNAUTHORIZED);
    }

    /**
     * ユーザーが一個前にアクセスしたURLを取得
     *
     * @return string
     */
    private function getIntendedUrl(): string
    {
        $intendedUrl = Session::get('url.intended', RouteServiceProvider::HOME);
        Session::forget('url.intended');

        return $intendedUrl;
    }
}