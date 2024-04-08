<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat;

use App\Models\Chat;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;

class ChatRepositoryImpl implements ChatRepository
{
    /**
     * {@inheritdoc}
     */
    public function create(StoreChatParams $params): Chat
    {
        return Chat::create($params->toArray());
    }
}
