<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup\Params;

use Carbon\CarbonImmutable;

class StoreChatGroupParams
{
    private readonly string $title;
    private readonly CarbonImmutable $lastChatDate;

    /**
     * @param string $title
     * @param CarbonImmutable $lastChatDate
     *
     * @return void
     */
    public function __construct(
        string $title,
        CarbonImmutable $lastChatDate,
    ) {
        $this->title = $title;
        $this->lastChatDate = $lastChatDate;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'last_chat_date' => $this->lastChatDate,
        ];
    }
}