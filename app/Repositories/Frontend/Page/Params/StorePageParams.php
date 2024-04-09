<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Page\Params;

use Carbon\CarbonImmutable;

class StorePageParams
{
    private readonly ?string $id;
    private readonly int $page;
    private readonly string $chatId;
    private readonly ?CarbonImmutable $createdAt;
    private readonly ?CarbonImmutable $updatedAt;
    private readonly ?CarbonImmutable $deletedAt;

    /**
     * @param ?string $id
     * @param int $page
     * @param string $chatId
     * @param ?CarbonImmutable $createdAt
     * @param ?CarbonImmutable $updatedAt
     * @param ?CarbonImmutable $deletedAt
     *
     * @return void
     */
    public function __construct(
        ?string $id,
        int $page,
        string $chatId,
        ?CarbonImmutable $createdAt,
        ?CarbonImmutable $updatedAt,
        ?CarbonImmutable $deletedAt,
    ) {
        $this->id = $id;
        $this->page = $page;
        $this->chatId = $chatId;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    /**
     * insert するためのパラメーターを返す
     *
     * @return array
     */
    public function toArrayForInsert(): array
    {
        return [
            'id' => $this->id,
            'page' => $this->page,
            'chat_id' => $this->chatId,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'deleted_at' => $this->deletedAt,
        ];
    }

    /**
     * create するためのパラメーターを返す
     *
     * @return array
     */
    public function toArrayForCreate(): array
    {
        return [
            'page' => $this->page,
            'chat_id' => $this->chatId,
        ];
    }
}