<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\ChatGroup\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\ChatGroup\UpdateChatGroupRequest;
use App\Http\Resources\Frontend\ChatGroup\UpdateChatGroupResource;
use App\UseCase\Frontend\ChatGroup\Api\UpdateChatGroupUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UpdateChatGroupController extends Controller
{
    /**
     * @param UpdateChatGroupUseCase $updateChatGroupUseCase
     */
    public function __construct(
        private readonly UpdateChatGroupUseCase $updateChatGroupUseCase
    ){
    }

    /**
     *
     * @return JsonResponse
     */
    public function __invoke(UpdateChatGroupRequest $request): JsonResponse
    {
        $chatGroup = $this->updateChatGroupUseCase->execute(
            $request->getChatGroupId(),
            $request->getTitle()
        );

        return response()->json(new UpdateChatGroupResource($chatGroup), Response::HTTP_OK);
    }
}
