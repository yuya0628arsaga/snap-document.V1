<?php

namespace App\Http\Resources\Frontend\Chat;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class FetchChatsResource extends JsonResource
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
            'date' => $this['date'],
            'question' => $this['question'],
            'answer' => $this['answer'],
            'pages' => static::getPages($this['pages']),
        ];
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
