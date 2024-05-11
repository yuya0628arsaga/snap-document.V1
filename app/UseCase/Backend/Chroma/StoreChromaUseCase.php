<?php

declare(strict_types=1);

namespace App\UseCase\Backend\Chroma;

use App\Exceptions\GptEngineProcessException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class StoreChromaUseCase
{
    /**
     * @param string $documentName 使用するドキュメント名
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    public function execute(string $documentName): array
    {
        [$message] = $this->getResFromGptEngine($documentName);

        return [
            'message' => $message,
        ];
    }

    /**
     * gpt_engine にChromaへの保存を依頼
     *
     * @param string $documentName
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    private function getResFromGptEngine(string $documentName): array
    {
        $responseFromGptEngine = Http::timeout(-1)->withHeaders([
            'Content-Type' => 'application/json',
        ])->post(config('api.gpt_engine.endpoint').'/chroma', [
            'document_name' => $documentName,
        ]);

        if ($responseFromGptEngine['status'] !== Response::HTTP_OK) {
            ['status' => $status, 'message' => $errorMessage] = $responseFromGptEngine;

            throw new GptEngineProcessException(message: $errorMessage, code: $status);
        };

        return [
            $responseFromGptEngine['message'],
        ];
    }
}
