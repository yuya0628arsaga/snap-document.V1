<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\ChatImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatImageSeeder extends Seeder
{
    /** chat1つに対して作成するchatImagesのレコード数 */
    private const MAX_CHAT_IMAGES_RECORD_FOR_ChAT = 2;

    /** @var Collection  */
    private Collection $chats;

    /**
     * @return void
     */
    public function __construct()
    {
        $this->chats = Chat::all();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->chats as $chat) {
            $chatImages = ChatImage::factory([
                'chat_id' => $chat->id,
            ])
            ->count(self::MAX_CHAT_IMAGES_RECORD_FOR_ChAT)
            ->make()
            ->each(fn ($chatImage) => $chatImage->id = strtolower((string) Str::ulid()))
            ->toArray();

            ChatImage::insert($chatImages);
        }
    }
}
