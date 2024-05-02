<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chat\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Chats\FetchChatsRequest;
use App\Http\Resources\Frontend\Chat\FetchChatsResource;
use App\UseCase\Frontend\Chat\Api\FetchChatsUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class FetchChatsController extends Controller
{
    /**
     * @param FetchChatsUseCase $fetchChatsUseCase
     */
    public function __construct(
        private readonly FetchChatsUseCase $fetchChatsUseCase
    ){
    }

    /**
     *
     * @return JsonResponse
     */
    public function __invoke(FetchChatsRequest $request): JsonResponse
    {
        $chats = $this->fetchChatsUseCase->execute(
            $request->getChatGroupId()
        );

        return response()->json(FetchChatsResource::collection($chats), Response::HTTP_OK);
    }
}
