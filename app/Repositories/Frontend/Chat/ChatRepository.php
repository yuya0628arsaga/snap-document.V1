<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat;

use App\Models\Chat;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;

interface ChatRepository
{
    /**
     * 質問と回答を保存する
     *
     * @param StoreChatParams $params
     * @return Chat
     */
    public function store(StoreChatParams $params): Chat;
}
