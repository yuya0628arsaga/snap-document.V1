<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\User;

use App\Models\User;

class UserRepositoryImpl implements UserRepository
{
    /**
     * {@inheritdoc}
     */
    public function firstOrCreate(array $where, array $params): User
    {
        return User::firstOrCreate($where, $params);
    }
}
