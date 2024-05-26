<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\User;

use App\Models\User;

interface UserRepository
{
   /**
    * userデータの保存or更新
    *
    * @param array $where
    * @param array $params
    *
    * @return User
    */
    public function updateOrCreate(array $where, array $params): User;
}
