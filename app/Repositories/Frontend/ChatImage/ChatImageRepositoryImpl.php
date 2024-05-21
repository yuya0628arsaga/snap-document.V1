<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\ChatImage;

use App\Models\ChatImage;

class ChatImageRepositoryImpl implements ChatImageRepository
{
    /**
     * {@inheritdoc}
     */
    public function insert(array $records): void
    {
        ChatImage::insert($records);
    }
}
