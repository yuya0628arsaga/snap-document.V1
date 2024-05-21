<?php

declare(strict_types=1);

namespace App\Http\Controllers\Backend\Document\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Document\GenerateImageUploadPresignedUrlRequest;
use App\Repositories\S3\S3Repository;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class GenerateImageUploadPresignedUrlController extends Controller
{
    private const DISK_NAME = 's3';

    /**
     * @param S3Repository $s3Repository
     */
    public function __construct(
        private readonly S3Repository $s3Repository
    ){
    }

    /**
     * @param GenerateImageUploadPresignedUrlRequest $request
     *
     * @return JsonResponse
     */
    public function __invoke(GenerateImageUploadPresignedUrlRequest $request): JsonResponse
    {
        $documentName = $request->getDocumentName();
        $fileName = $request->getFileName();

        $key = $documentName.'/'.$fileName;
        $presignedUrl = $this->s3Repository->generateUploadPresignedUrl(self::DISK_NAME, $key);

        return response()->json($presignedUrl, Response::HTTP_OK);
    }
}