<?php

declare(strict_types=1);

namespace App\Traits\Common;

use DateTimeInterface;

trait SerializeDate
{
    /**
     * 配列/JSONシリアル化の日付の準備
     *
     * @param DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
