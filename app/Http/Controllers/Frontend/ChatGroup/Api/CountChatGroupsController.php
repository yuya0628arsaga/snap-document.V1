<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\ChatGroup\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ChatGroup\CountChatGroupsResource;
use App\UseCase\Frontend\ChatGroup\Api\CountChatGroupsUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CountChatGroupsController extends Controller
{
    /**
     * @param CountChatGroupsUseCase $countChatGroupsUseCase
     */
    public function __construct(
        private readonly CountChatGroupsUseCase $countChatGroupsUseCase
    ){
    }

    /**
     *
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        $chatGroupsCount = $this->countChatGroupsUseCase->execute();

        return response()->json(
            new CountChatGroupsResource(['chatGroupsCount' => $chatGroupsCount]),
            Response::HTTP_OK
        );
    }
}