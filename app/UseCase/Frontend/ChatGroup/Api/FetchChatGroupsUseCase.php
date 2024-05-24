<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\ChatGroup\Api;

use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Services\Frontend\Auth\AuthUserGetter;
use Carbon\CarbonImmutable;
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
        $user = AuthUserGetter::get();
        $chatGroups = $this->chatGroupRepository->fetch(whereParams: ['user_id' => $user->id]);

        return $chatGroups->map(function ($chatGroup) {
            $formatLastChatDate = (new CarbonImmutable($chatGroup->last_chat_date))->format('Y年m月');
            $chatGroup->last_chat_date = $formatLastChatDate;

            return $chatGroup;
        });
    }
}
