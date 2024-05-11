<?php

declare(strict_types=1);

namespace App\Http\Controllers\Backend\Chroma;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Chroma\StoreChromaRequest;
use App\Http\Resources\Backend\Chroma\StoreChromaResource;
use App\UseCase\Backend\Chroma\StoreChromaUseCase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class StoreChromaController extends Controller
{
    /**
     * @param StoreChromaUseCase $storeChromaUseCase
     */
    public function __construct(
        private readonly StoreChromaUseCase $storeChromaUseCase
    ){
    }

    /**
     * @param StoreChromaRequest $request
     *
     * @return JsonResponse
     */
    public function __invoke(StoreChromaRequest $request): JsonResponse
    {
        $response = $this->storeChromaUseCase->execute(
            $request->getDocumentName()
        );

        return response()->json(new StoreChromaResource($response), Response::HTTP_OK);
    }
}
