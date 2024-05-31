<?php

namespace Database\Factories;

use App\Models\ChatGroup;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'title' => fake()->title(),
            'last_chat_date' => CarbonImmutable::now(),
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }
}
