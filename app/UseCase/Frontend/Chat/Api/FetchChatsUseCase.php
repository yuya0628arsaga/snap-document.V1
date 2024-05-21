<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Document\DocumentRepository;
use Illuminate\Support\Collection;

class FetchChatsUseCase
{
    /**
     * @param ChatRepository $chatRepository
     * @param DocumentRepository $documentRepository
     */
    public function __construct(
        private readonly ChatRepository $chatRepository,
        private readonly DocumentRepository $documentRepository,
    ) {
    }

    /**
     *
     * @param string $chatGroupId
     *
     * @return Collection
     */
    public function execute(string $chatGroupId): Collection
    {
        $chats = $this->chatRepository->fetch(
            with: ['pages', 'chat_images'],
            whereParams: ['chat_group_id' => $chatGroupId],
            columns: ['id', 'date', 'question', 'answer', 'document_id'],
        );

        $chats = $this->addDocumentNameToChats($chats);

        return $chats;
    }

    /**
     * chatで使用したドキュメントの名前を追加
     *
     * @param Collection $chats
     *
     * @return Collection
     */
    private function addDocumentNameToChats(Collection $chats): Collection
    {
        $documents = $this->documentRepository->fetchAll();

        return $chats->map(function ($chat) use ($documents) {
            $usedDocument = $documents->firstWhere('id', $chat->document_id);
            $chat->document_name = $usedDocument['name'];

            return $chat;
        });
    }
}
