<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteChatGroupUseCase
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
     * @param string $chatGroupId
     *
     * @return Collection
     */
    public function execute(string $chatGroupId): void
    {
        DB::transaction(function () use ($chatGroupId) {
            Log::info('[Start] チャットグループの削除処理を開始します。', [
                'method' => __METHOD__,
                'chat_group_id' => $chatGroupId,
                'user_id' => $userId ?? null,
            ]);

            $chatGroup = $this->chatGroupRepository->findOrFail($chatGroupId);
            $this->chatGroupRepository->delete($chatGroup);

            Log::info('[End] チャットグループの削除処理を完了しました。', [
                'method' => __METHOD__,
                'chat_group_id' => $chatGroupId,
                'user_id' => $userId ?? null,
            ]);
        });
    }
}
