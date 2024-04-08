<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api;

use App\Http\Controllers\Controller;
use App\UseCase\Frontend\Chat\Api\StoreChatUseCase;

class StoreChatController extends Controller
{
    /**
     * @param StoreChatUseCase $storeChatUseCase
     */
    public function __construct(
        private readonly StoreChatUseCase $storeChatUseCase
    ){
    }

    /**
     * @return array
     */
    public function __invoke(): array
    {
        return $this->storeChatUseCase->execute('テストクエッション', 'Man_Digest_v9');
    }
}
