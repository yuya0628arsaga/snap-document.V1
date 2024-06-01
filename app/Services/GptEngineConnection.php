<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GptEngineConnection implements GptEngineConnectionInterface
{
    /**
     * {@inheritDoc}
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