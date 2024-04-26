<?php

declare(strict_types=1);

namespace App\Logging;

class JsonFormatter extends \Monolog\Formatter\JsonFormatter
{
    public function __construct()
    {
        parent::__construct(includeStacktraces: true);
    }
}