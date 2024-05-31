<?php

declare(strict_types=1);

namespace App\Services;

/**
 * gpt_engineと通信する
 */
interface GptEngineConnectionInterface
{
    /**
     * POSTリクエスト
     *
     * @param string $url
     * @param array $params
     *
     * @return array
     */
    public static function post(string $url, array $params): array;
}