<?php

namespace Database\Seeders;

use App\Models\ChatGroup;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatGroupSeeder extends Seeder
{
    /** user1人に対して作成するchatGroupのレコード数 */
    private const MAX_CHAT_GROUPS_RECORD_FOR_USER = 10;

    /** @var Collection  */
    private Collection $users;

    /**
     * @return void
     */
    public function __construct()
    {
        $this->users = User::all();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->users as $user) {
            $chatGroups = ChatGroup::factory([
                    'user_id' => $user->id
                ])
                ->count(self::MAX_CHAT_GROUPS_RECORD_FOR_USER)
                ->make()
                ->each(fn ($chatGroup) => $chatGroup->id = strtolower((string) Str::ulid()))
                ->toArray();

            ChatGroup::insert($chatGroups);
        }
    }
}
