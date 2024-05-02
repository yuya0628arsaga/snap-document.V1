<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup\Params;


class StoreChatGroupParams
{
    private readonly string $title;
    private readonly string $lastChatDate;

    /**
     * @param string $title
     * @param string $lastChatDate
     *
     * @return void
     */
    public function __construct(
        string $title,
        string $lastChatDate,
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