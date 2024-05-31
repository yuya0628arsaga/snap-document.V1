<?php

declare(strict_types=1);

namespace App\UseCase\Backend\Chroma;

use App\Exceptions\GptEngineProcessException;
use App\Services\GptEngineConnectionInterface;
use Symfony\Component\HttpFoundation\Response;

class StoreChromaUseCase
{
    /**
     * @param GptEngineConnectionInterface $gptEngineConnection
     */
    public function __construct(
        private readonly GptEngineConnectionInterface $gptEngineConnection,
    ){
    }

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
        $responseFromGptEngine = $this->gptEngineConnection::post(
            url: '/chroma',
            params: [
                'document_name' => $documentName,
            ]
        );

        if ($responseFromGptEngine['status'] !== Response::HTTP_OK) {
            ['status' => $status, 'message' => $errorMessage] = $responseFromGptEngine;

            throw new GptEngineProcessException(message: $errorMessage, code: $status);
        };

        return [
            $responseFromGptEngine['message'],
        ];
    }
}
