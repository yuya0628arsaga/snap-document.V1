<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup;

use App\Models\ChatGroup;
use App\Repositories\Frontend\ChatGroup\Params\StoreChatGroupParams;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use Illuminate\Support\Collection;

class ChatGroupRepositoryImpl implements ChatGroupRepository
{
    /**
     * {@inheritdoc}
     */
    public function store(StoreChatGroupParams $params): ChatGroup
    {
        return ChatGroup::create($params->toArray());
    }

    /**
     * {@inheritdoc}
     */
    public function fetch(array $with = [], array $columns = ['*'], array $whereParams = []): Collection
    {
        return ChatGroup::with($with)
            ->where($whereParams)
            ->orderBy('last_chat_date', 'desc')
            ->get($columns);
    }

    /**
     * {@inheritdoc}
     */
    public function update(string $chatGroupId, UpdateChatGroupParams $params): ChatGroup
    {
        $chatGroup = $this->findOrFail($chatGroupId);
        $chatGroup->update($params->toArray());

        return $chatGroup;
    }

    /**
     * {@inheritdoc}
     */
    public function findOrFail(string $chatGroupId): ChatGroup
    {
        return ChatGroup::findOrFail($chatGroupId);
    }
}
