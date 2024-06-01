<?php

namespace Database\Factories;

use App\Models\Chat;
use App\Models\ChatGroup;
use App\Models\Document;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chat>
 */
class ChatFactory extends Factory
{
     /** @var string */
     protected $model = Chat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => CarbonImmutable::now(),
            'question' => fake()->realText(30),
            'answer' => fake()->realText(30),
            'question_token_count' => fake()->numberBetween(1, 100),
            'answer_token_count' => fake()->numberBetween(1, 100),
            'cost' => fake()->numberBetween(1, 100),
            'user_id' => User::factory(),
            'document_id' => Document::factory(),
            'chat_group_id' => ChatGroup::factory(),
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }
}
