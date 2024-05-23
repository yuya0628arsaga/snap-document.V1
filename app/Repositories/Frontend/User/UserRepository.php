<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\User;

use App\Models\User;

interface UserRepository
{
   /**
    * userデータの取得or保存
    *
    * @param array $where
    * @param array $params
    *
    * @return User
    */
    public function firstOrCreate(array $where, array $params): User;
}
