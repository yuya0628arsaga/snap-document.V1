<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\ChatGroup\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\ChatGroup\DeleteChatGroupRequest;
use App\Http\Resources\Frontend\ChatGroup\FetchChatGroupsResource;
use App\UseCase\Frontend\ChatGroup\Api\DeleteChatGroupUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DeleteChatGroupController extends Controller
{
    /**
     * @param DeleteChatGroupUseCase $deleteChatGroupUseCase
     */
    public function __construct(
        private readonly DeleteChatGroupUseCase $deleteChatGroupUseCase
    ){
    }

    /**
     *
     * @return JsonResponse
     */
    public function __invoke(DeleteChatGroupRequest $request): JsonResponse
    {
        $this->deleteChatGroupUseCase->execute($request->getChatGroupId());

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
