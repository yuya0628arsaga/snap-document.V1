<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup;

use App\Models\ChatGroup;
use App\Repositories\Frontend\ChatGroup\Params\StoreChatGroupParams;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use Illuminate\Support\Collection;

interface ChatGroupRepository
{
    /**
     * チャットグループを保存
     *
     * @param StoreChatParams $params
     *
     * @return ChatGroup
     */
    public function store(StoreChatGroupParams $params): ChatGroup;

    /**
     * チャットグループ一覧を取得
     *
     * @param array $with
     * @param array $columns
     * @param array $whereParams
     *
     * @return Collection
     */
    public function fetch(array $with = [], array $columns = ['*'], array $whereParams = []): Collection;

    /**
     * チャットグループを更新
     *
     * @param string $chatGroupId
     * @param UpdateChatGroupParams $params
     *
     * @return ChatGroup
     */
    public function update(string $chatGroupId, UpdateChatGroupParams $params): ChatGroup;

    /**
     * チャットグループを取得
     *
     * @param string $chatGroupId
     *
     * @return ChatGroup
     */
    public function findOrFail(string $chatGroupId): ChatGroup;

    /**
     * チャットグループの削除
     *
     * @param ChatGroup
     *
     * @return void
     */
    public function delete(ChatGroup $chatGroup): void;

     /**
     * チャットグループの存在チェック
     *
     * @param string $chatGroupId
     *
     * @return bool
     */
    public function exists(string $chatGroupId): bool;
}
