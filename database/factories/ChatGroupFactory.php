<?php

namespace Database\Factories;

use App\Models\ChatGroup;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatGroup>
 */
class ChatGroupFactory extends Factory
{
     /** @var string */
     protected $model = ChatGroup::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => '質問_'.strtolower((string) Str::uuid()),
            'last_chat_date' => CarbonImmutable::now(),
            'user_id' => User::factory(),
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }
}
