<?php

namespace Database\Factories;

use App\Models\Document;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
     /** @var string */
     protected $model = Document::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Man_Digest_v9',
            'extension' => 'pdf',
            'url' => 'https://public-bucket-name.s3.ap-northeast-1.amazonaws.com',
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }
}
