<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Services\Frontend\Auth\AuthUserGetter;

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
        $user = AuthUserGetter::get();
        return $this->chatGroupRepository->count(whereParams: ['user_id' => $user->id]);
    }
}
