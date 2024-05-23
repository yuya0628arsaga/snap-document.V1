<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate extends Middleware
{
    /**
     * Handle an unauthenticated user.
     *
     * @param Request $request
     * @param array $guards
     *
     * @throws AuthenticationException|HttpResponseException
     *
     * @return void
     */
    protected function unauthenticated($request, array $guards): void
    {
        $msg = 'Unauthenticated';

        if ($request->is('api/*')) {
            $response = response()->error(
                status: Response::HTTP_UNAUTHORIZED,
                msg: $msg,
            );

            throw new HttpResponseException($response);
        }

        throw new AuthenticationException(
            $msg, $guards, $this->redirectToWithGuards($request, $guards)
        );
    }

    /**
     * 認証済みの場合は null, 未認証の場合は login画面に遷移させる
     * $guards の中身によって遷移先を変える
     *
     * @param Request $request
     * @param array $guards
     *
     * @return string|null
     */
    private function redirectToWithGuards(Request $request, array $guards): ?string
    {
        if (! $request->expectsJson()) {
            if (in_array('admin', $guards, true)) {
                // return route('admin.auth.index');
            }

            return route('user.auth.index');
        }

        return null;
    }
}
