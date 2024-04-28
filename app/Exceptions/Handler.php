<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * {@inheritDoc}
     */
    public function render($request, Throwable $e): JsonResponse | SymfonyResponse
    {
        // Api Route でのエラー（ブラウザにエラー用のJSONを返す）
        if ($request->is('api/*')) {
            $errors = [];

            switch (true) {
                case $this->isHttpException($e):
                    // HttpException のエラーハンドリング
                    $status = $e->getStatusCode();
                    $msg = SymfonyResponse::$statusTexts[$status] ?? 'HttpExceptionエラー';
                    break;

                case $e instanceof AuthenticationException:
                    // 401 Unauthorized のエラーハンドリング
                    $status = SymfonyResponse::HTTP_UNAUTHORIZED;
                    $msg = $e->getMessage();
                    break;

                case $e instanceof TokenMismatchException:
                    // 419 Page Expired のエラーハンドリング
                    $status = 419;
                    $msg = 'CSRF Token Mismatch';
                    break;

                case $e instanceof ValidationException:
                    // 422 Unprocessable Content のエラーハンドリング
                    $status = $e->status;
                    $msg = $e->getMessage();
                    $errorArrays = $e->errors();
                    foreach ($errorArrays as $fieldErrors) {
                        $errors = array_merge($errors, array_values($fieldErrors));
                    }
                    break;

                case $e instanceof ModelNotFoundException:
                    // 404 Not Found のエラーハンドリング
                    $status = SymfonyResponse::HTTP_NOT_FOUND;
                    $msg = $e->getMessage() ?: 'Not Found';
                    break;

                case $e instanceof CommonException:
                    // 独自のエラーハンドリング
                    $status = $e->getCode();
                    $msg = $e->getMessage();
                    break;

                default:
                    // 上記以外の例外では一律で 500 Server Error を返すようにする
                    $status = SymfonyResponse::HTTP_INTERNAL_SERVER_ERROR;
                    $msg = 'Server Error: '.$e->getMessage();
            }

            Log::info("{$status}エラーが発生しました。", [
                'method' => __METHOD__,
                'exception' => get_class($e),
                'message' => $msg,
                'stacktrace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => $status,
                'message' => $msg,
                'errors' => $errors,
            ], $status);
        }

        // Web Route でのエラー（ブラウザにエラー用のhtmlを返却する）
        Log::info('apiルート以外で例外が発生しました。デフォルトのレンダリングを適応します。', [
            'method' => __METHOD__,
            'exception' => get_class($e),
            'message' => $e->getMessage(),
            'stacktrace' => $e->getTraceAsString(),
        ]);
        // 404.blade.php などを返す
        return parent::render($request, $e);
    }
}
