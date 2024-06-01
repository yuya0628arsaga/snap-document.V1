<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatSeeder extends Seeder
{
    /** chatGroup1つに対して作成するchatのレコード数 */
    private const MAX_CHATS_RECORD_FOR_ChAT_GROUP = 10;

    /** @var Collection  */
    private Collection $users;

    /** @var Collection  */
    private Collection $documents;

    /**
     * @return void
     */
    public function __construct()
    {
        $this->users = User::all();
        $this->documents = Document::all();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->users as $user) {
            foreach ($user->chat_groups as $chatGroup) {
                $chats = Chat::factory([
                    'user_id' => $user->id,
                    'document_id' => (fake()->randomElement($this->documents->toArray()))['id'],
                    'chat_group_id' => $chatGroup->id,
                ])
                ->count(self::MAX_CHATS_RECORD_FOR_ChAT_GROUP)
                ->make()
                ->each(fn ($chat) => $chat->id = strtolower((string) Str::ulid()))
                ->toArray();

                Chat::insert($chats);
            }
        }
    }
}
