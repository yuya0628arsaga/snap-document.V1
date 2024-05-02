<?php

namespace App\Http\Resources\Frontend\ChatGroup;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class FetchChatGroupsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'title' => $this['title'],
            'lastChatDate' => $this['lastChatDate'],
            'chats' => static::getChats($this['chats']),
        ];
    }

    /**
     *
     * @param Collection $chats
     * @return Collection
     */
    static private function getChats(Collection $chats): Collection
    {
        return $chats->map(function ($chat) {
            return [
                'id' => $chat['id'],
                'date' => $chat['date'],
                'question' => $chat['question'],
                'answer' => $chat['answer'],
                'pages' => static::getPages($chat['pages']),
                'user_id' => $chat['user_id'],
                'document_id' => $chat['document_id'],
                'chat_group_id' => $chat['chat_group_id']
            ];
        });
    }

    /**
     *
     * @param Collection $pages
     * @return Collection
     */
    static private function getPages(Collection $pages): Collection
    {
        return $pages->map(function ($page) {
            return $page['page'];
        });
    }
}
