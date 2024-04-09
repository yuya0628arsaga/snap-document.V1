<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Page;

use App\Models\Page;
use App\Repositories\Frontend\Page\Params\StorePageParams;

class PageRepositoryImpl implements PageRepository
{
    /**
     * {@inheritdoc}
     */
    public function store(StorePageParams $storePageParams): Page
    {
        return Page::create($storePageParams->toArray());
    }
}
