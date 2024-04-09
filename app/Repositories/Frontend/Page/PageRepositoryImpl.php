<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Page;

use App\Models\Page;

class PageRepositoryImpl implements PageRepository
{
    /**
     * {@inheritdoc}
     */
    public function insert(array $records): void
    {
        Page::insert($records);
    }
}
