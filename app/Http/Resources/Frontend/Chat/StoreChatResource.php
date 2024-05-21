<?php

namespace App\Http\Resources\Frontend\Chat;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'answer' => $this['answer'],
            'images' => $this['images'],
            'pdfPages' => $this['pdfPages'],
            'chatGroupId' => $this['chatGroupId'],
        ];
    }
}
