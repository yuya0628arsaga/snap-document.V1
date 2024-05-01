<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Chat;

use App\Models\Chat;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use Illuminate\Support\Collection;

interface ChatRepository
{
    /**
     * 質問と回答を保存する
     *
     * @param StoreChatParams $params
     * @return Chat
     */
    public function store(StoreChatParams $params): Chat;

    /**
     * 質問一覧を取得
     *
     * @param array $with
     * @param array $columns
     * @param array $whereParams
     * @return Collection
     */
    public function fetch(array $with = [], array $columns = ['*'], array $whereParams = []): Collection;
}
