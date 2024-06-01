<?php

namespace Database\Seeders;

use App\Models\User;

use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\LazyCollection;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /** 作成するusersのレコード数 */
    private const MAX_USERS_RECORD = 10;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * MEMO::factoryを使うと処理に時間がかかるため配列にしてinsertで一括保存する
         */
        $users = LazyCollection::range(1, self::MAX_USERS_RECORD)->map(function ($i) {
            return [
                'id' => strtolower((string) Str::ulid()),
                'nickname' => fake()->randomElement(["ニックネーム{$i}", null]),
                'name' => "ユーザー{$i}",
                'email' => "user{$i}@example.com",
                'avatar_url' => fake()->randomElement([fake()->url(), null]),
                'email_verified_at' => CarbonImmutable::now(),
                'password' => fake()->randomElement([Hash::make('password'), null]), // Googleログインの場合はpasswordがnull
                'remember_token' => null,
                'created_at' => CarbonImmutable::now(),
                'updated_at' => CarbonImmutable::now(),
                'deleted_at' => null,
            ];
        });

        User::insert($users->toArray());
    }
}
