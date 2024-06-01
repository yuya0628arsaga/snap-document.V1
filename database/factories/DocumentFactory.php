<?php

namespace Database\Factories;

use App\Models\Document;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        $BUCKET = config('filesystems.disks.s3.bucket');

        return [
            'name' => fake()->randomElement(['Man_Digest_v9', 'PCBmanualV5', 'PCBmanual3DV5']),
            'extension' => 'pdf',
            'url' => 'https://'.$BUCKET.'.s3.ap-northeast-1.amazonaws.com',
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }
}
