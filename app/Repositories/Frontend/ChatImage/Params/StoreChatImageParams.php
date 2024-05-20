<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatImage\Params;

use Carbon\CarbonImmutable;

class StoreChatImageParams
{
    private readonly ?string $id;
    private readonly string $name;
    private readonly string $url;
    private readonly string $chatId;
    private readonly ?CarbonImmutable $createdAt;
    private readonly ?CarbonImmutable $updatedAt;
    private readonly ?CarbonImmutable $deletedAt;

    /**
     * @param ?string $id
     * @param string $name
     * @param string $url
     * @param string $chatId
     * @param ?CarbonImmutable $createdAt
     * @param ?CarbonImmutable $updatedAt
     * @param ?CarbonImmutable $deletedAt
     *
     * @return void
     */
    public function __construct(
        ?string $id,
        string $name,
        string $url,
        string $chatId,
        ?CarbonImmutable $createdAt,
        ?CarbonImmutable $updatedAt,
        ?CarbonImmutable $deletedAt,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->url = $url;
        $this->chatId = $chatId;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    /**
     * insertするためのパラメーターを返す
     *
     * @return array
     */
    public function toArrayForInsert(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'chat_id' => $this->chatId,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'deleted_at' => $this->deletedAt,
        ];
    }

    /**
     * createするためのパラメーターを返す
     *
     * @return array
     */
    public function toArrayForCreate(): array
    {
        return [
            'name' => $this->name,
            'url' => $this->url,
            'chat_id' => $this->chatId,
        ];
    }
}