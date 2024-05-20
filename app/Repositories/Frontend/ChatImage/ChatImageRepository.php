<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatImage;

use App\Repositories\Frontend\ChatImage\Params\StoreChatImageParams;

interface ChatImageRepository
{
   /**
    * 回答内で使用されている画像情報を保存する
    *
    * @param array<StoreChatImageParams> $records
    *
    * @return void
    */
    public function insert(array $records): void;
}
