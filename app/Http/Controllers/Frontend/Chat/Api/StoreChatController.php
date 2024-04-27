<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api;

use App\Http\Controllers\Controller;
// use App\Http\Requests\Frontend\Chat\StoreChatRequest;
use App\Http\Resources\Frontend\Chat\StoreChatResource;
use App\UseCase\Frontend\Chat\Api\StoreChatUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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
    //  * @param StoreChatRequest $request
     *
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        $response = $this->storeChatUseCase->execute(
            // $request->getQuestion(),
            // $request->getManualName(),
            // $request->getChatHistory(),
            '質問1',
            'Man_Digest_v9',
            [],
        );

        return response()->json(new StoreChatResource($response), Response::HTTP_OK);
    }
}
