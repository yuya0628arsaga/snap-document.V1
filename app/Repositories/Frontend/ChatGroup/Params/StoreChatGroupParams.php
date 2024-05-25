<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup\Params;

use Carbon\CarbonImmutable;

class StoreChatGroupParams
{
    private readonly string $title;
    private readonly CarbonImmutable $lastChatDate;
    private readonly string $userId;

    /**
     * @param string $title
     * @param CarbonImmutable $lastChatDate
     * @param string $userId
     *
     * @return void
     */
    public function __construct(
        string $title,
        CarbonImmutable $lastChatDate,
        string $userId,
    ) {
        $this->title = $title;
        $this->lastChatDate = $lastChatDate;
        $this->userId = $userId;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'last_chat_date' => $this->lastChatDate,
            'user_id' => $this->userId,
        ];
    }
}