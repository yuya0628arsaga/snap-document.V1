<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Repositories\Frontend\Chat\ChatRepository;
use Illuminate\Support\Collection;

class FetchChatsUseCase
{
    /**
     * @param ChatRepository $chatRepository
     */
    public function __construct(
        private readonly ChatRepository $chatRepository,
    ) {
    }

    /**
     *
     * @param string $chatGroupId
     *
     * @return Collection
     */
    public function execute(string $chatGroupId): Collection
    {
        return $this->chatRepository->fetch(
            with: ['pages'],
            whereParams: ['chat_group_id' => $chatGroupId],
            columns: ['id', 'date', 'question', 'answer'],
        );
    }
}
