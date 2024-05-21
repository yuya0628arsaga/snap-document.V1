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
            'pdfPages' => static::getPages($this['pages']),
            'images' => static::getImages($this['chat_images']),
            'documentName' => $this['document_name'],
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

    /**
     *
     * @param Collection $images
     * @return Collection
     */
    static private function getImages(Collection $images): Collection
    {
        return $images->map(function ($image) {
            return [
                'name' => $image['name'],
                'url' => $image['url'],
            ];
        });
    }
}
