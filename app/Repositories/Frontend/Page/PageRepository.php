<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Page;

use App\Models\Page;
use App\Repositories\Frontend\Page\Params\StorePageParams;

interface PageRepository
{
   /**
    * 回答する際に参照したPDFページを保存する
    *
    * @param StorePageParams $params
    *
    * @return Page
    */
    public function store(StorePageParams $params): Page;
}
