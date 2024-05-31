<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * gpt_engineと通信する
 */
class GptEngineConnection
{
    /**
     * POSTリクエスト
     *
     * @param string $url
     * @param array $params
     *
     * @return array
     */
    public static function post(string $url, array $params): array
    {
        return
            Http::timeout(-1)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post(
                config('api.gpt_engine.endpoint').$url,
                $params,
            )->json();
    }
}