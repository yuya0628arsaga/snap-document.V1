<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use Illuminate\Support\Collection;

class FetchChatGroupsUseCase
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
     * @return Collection
     */
    public function execute(): Collection
    {
        return $this->chatGroupRepository->fetch(
            with: ['chats.pages'],
        );
    }
}
