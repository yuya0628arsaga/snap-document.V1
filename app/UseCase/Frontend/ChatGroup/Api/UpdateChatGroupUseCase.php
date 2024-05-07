<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Models\ChatGroup;
use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateChatGroupUseCase
{
    /**
     * @param ChatGroupRepository $chatGroupRepository
     */
    public function __construct(
        private readonly ChatGroupRepository $chatGroupRepository,
    ) {
    }

    /**
     *
     * @return ChatGroup
     */
    public function execute(string $chatGroupId, string $title): ChatGroup
    {
        return DB::transaction(function () use ($chatGroupId, $title) {
            $params = new UpdateChatGroupParams(title: $title);

            Log::info('[Start] チャットグループの更新処理を開始します。', [
                'method' => __METHOD__,
                'chat_group_id' => $chatGroupId,
                'user_id' => $userId ?? null,
            ]);

            $chatGroup = $this->chatGroupRepository->update($chatGroupId, $params);

            Log::info('[End] チャットグループの更新処理が完了しました。', [
                'method' => __METHOD__,
                'chat_group_id' => $chatGroupId,
                'user_id' => $userId ?? null,
            ]);

            return $chatGroup;
        });
    }
}
