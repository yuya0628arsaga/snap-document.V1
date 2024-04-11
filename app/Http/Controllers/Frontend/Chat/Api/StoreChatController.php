<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Chat\StoreChatRequest;
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
     * @param StoreChatRequest $request
     *
     * @return JsonResponse
     */
    public function __invoke(StoreChatRequest $request): JsonResponse
    {
        $response = $this->storeChatUseCase->execute($request->getQuestion(), $request->getManualName());

        return response()->json($response->collect(), SymfonyResponse::HTTP_OK);
    }
}
