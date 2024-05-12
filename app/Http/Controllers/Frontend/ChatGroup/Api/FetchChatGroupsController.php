<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\ChatGroup\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ChatGroup\FetchChatGroupsResource;
use App\UseCase\Frontend\ChatGroup\Api\FetchChatGroupsUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class FetchChatGroupsController extends Controller
{
    /**
     * @param FetchChatGroupsUseCase $fetchChatGroupsUseCase
     */
    public function __construct(
        private readonly FetchChatGroupsUseCase $fetchChatGroupsUseCase
    ){
    }

    /**
     *
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        $chatGroups = $this->fetchChatGroupsUseCase->execute();
        $response = FetchChatGroupsResource::collection($chatGroups);

        return response()->json($response, Response::HTTP_OK);
    }
}
