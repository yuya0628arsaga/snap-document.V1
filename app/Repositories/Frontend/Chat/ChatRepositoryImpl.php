<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat;

use App\Models\Chat;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use Illuminate\Support\Collection;

class ChatRepositoryImpl implements ChatRepository
{
    /**
     * {@inheritdoc}
     */
    public function store(StoreChatParams $params): Chat
    {
        return Chat::create($params->toArray());
    }

    /**
     * {@inheritdoc}
     */
    public function fetch(array $with = [], array $columns = ['*'], array $whereParams = []): Collection
    {
        return Chat::with($with)->where($whereParams)->get($columns);
    }
}
