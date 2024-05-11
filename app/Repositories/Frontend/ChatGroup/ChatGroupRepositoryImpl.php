<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup;

use App\Models\ChatGroup;
use App\Repositories\Frontend\ChatGroup\Params\StoreChatGroupParams;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use Illuminate\Pagination\LengthAwarePaginator;

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
    public function fetch(array $with = [], array $columns = ['*'], array $whereParams = []): LengthAwarePaginator
    {
        $MAX_PAGE = 10;

        return ChatGroup::with($with)
            ->where($whereParams)
            ->orderBy('last_chat_date', 'desc')
            ->paginate($MAX_PAGE, $columns);
    }

    /**
     * {@inheritdoc}
     */
    public function count(array $whereParams = []): int
    {
        return ChatGroup::where($whereParams)
            ->count();
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

    /**
     * {@inheritdoc}
     */
    public function delete(ChatGroup $chatGroup): void
    {
        $chatGroup->delete();
    }

    /**
     * {@inheritdoc}
     */
    public function exists(string $chatGroupId): bool
    {
        return ChatGroup::where('id', $chatGroupId)->exists();
    }
}
