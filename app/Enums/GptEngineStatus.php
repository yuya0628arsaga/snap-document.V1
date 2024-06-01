<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * gpt_engineのステータスコード
 * Enum GptEngineStatus
 */
enum GptEngineStatus: int
{
    case HTTP_OK = 200;
    case HTTP_INTERNAL_SERVER_ERROR = 500;
}
