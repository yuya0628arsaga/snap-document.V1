<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Repositories\Frontend\Chat\ChatRepository;
use Illuminate\Support\Collection;

class FetchChatsUseCase
{
    /**
     * @param ChatRepository $chatRepository
     */
    public function __construct(
        private readonly ChatRepository $chatRepository,
    ) {
    }

    /**
     *
     * @return Collection
     */
    public function execute(): Collection
    {
        return $this->chatRepository->fetch(
            with: ['pages'],
            columns: ['id', 'date', 'question', 'answer']
        );
    }
}
