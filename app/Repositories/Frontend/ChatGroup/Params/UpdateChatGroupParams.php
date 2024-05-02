<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatGroup\Params;


class UpdateChatGroupParams
{
    /**
     * @param ?string $title
     * @param ?string $lastChatDate
     *
     * @return void
     */
    public function __construct(
        private readonly ?string $title = null,
        private readonly ?string $lastChatDate = null,
    ) {
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $params = [
            'title' => $this->title,
            'last_chat_date' => $this->lastChatDate,
        ];

        return array_filter($params, function ($param) {
            return isset($param);
        });
    }
}