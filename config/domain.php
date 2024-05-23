<?php

declare(strict_types=1);

return [
    'admin_host' => 'admin.'.env('APP_DOMAIN', 'localhost'),
    // 'user_host' => 'user.'.env('APP_DOMAIN', 'localhost'),
    'user_host' => env('APP_DOMAIN', 'localhost'),
];
