<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    /** chat1つに対して作成するpageのレコード数 */
    private const MAX_PAGES_RECORD_FOR_ChAT = 3;

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
            $pages = Page::factory([
                'chat_id' => $chat->id,
            ])
            ->count(self::MAX_PAGES_RECORD_FOR_ChAT)
            ->make()
            ->each(fn ($page) => $page->id = strtolower((string) Str::ulid()))
            ->toArray();

            Page::insert($pages);
        }
    }
}
