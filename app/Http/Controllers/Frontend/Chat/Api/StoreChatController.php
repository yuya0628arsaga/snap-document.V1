<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api;

use App\Http\Controllers\Controller;
use App\UseCase\Frontend\Chat\Api\StoreChatUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

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
    public function __invoke(): JsonResponse
    {
        $response = $this->storeChatUseCase->execute('テストクエッション', 'Man_Digest_v9');

        return response()->json($response->collect(), SymfonyResponse::HTTP_OK);
    }
}
