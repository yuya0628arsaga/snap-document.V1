<?php

namespace Database\Factories;

use App\Models\Chat;
use App\Models\ChatGroup;
use App\Models\ChatImage;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatImage>
 */
class ChatImageFactory extends Factory
{
     /** @var string */
     protected $model = ChatImage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = '図'.fake()->numberBetween(1, 99);

        return [
            'name' => $name,
            'url' => 'https://bucket-name.s3.region.amazonaws.com/document_name/file_name',
            'chat_id' => Chat::factory(),
            'created_at' => CarbonImmutable::now(),
            'updated_at' => CarbonImmutable::now(),
            'deleted_at' => null,
        ];
    }

    /**
     * @param string $documentName
     *
     * @return array
     */
    public function withDocument($documentName)
    {
        return $this->state(function (array $attributes) use ($documentName) {
            $BUCKET = config('filesystems.disks.s3.bucket');
            $REGION = config('filesystems.disks.s3.region');

            return [
                'url' => 'https://'.$BUCKET.'.s3.'.$REGION.'.amazonaws.com/'.$documentName.'/'.$attributes['name'],
            ];
        });
    }
}
