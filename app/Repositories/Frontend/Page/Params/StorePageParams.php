<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Page\Params;

class StorePageParams
{
    private readonly int $page;
    private readonly string $chatId;

    /**
     * @param int $page
     * @param string $chatId
     *
     * @return void
     */
    public function __construct(
        int $page,
        string $chatId,
    ) {
        $this->page = $page;
        $this->chatId = $chatId;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'page' => $this->page,
            'chat_id' => $this->chatId,
        ];
    }
}