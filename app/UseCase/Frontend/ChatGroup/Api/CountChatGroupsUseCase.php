<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;

class CountChatGroupsUseCase
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
     * @return int
     */
    public function execute(): int
    {
        return $this->chatGroupRepository->count();
    }
}
