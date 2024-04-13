<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Exceptions\GptEngineProcessException;
use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use App\Repositories\Frontend\Document\DocumentRepository;
use App\Repositories\Frontend\Page\PageRepository;
use App\Repositories\Frontend\Page\Params\StorePageParams;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Support\Str;

class StoreChatUseCase
{
    /**
     * @param ChatRepository $chatRepository
     * @param DocumentRepository $documentRepository
     * @param PageRepository $pageRepository
     */
    public function __construct(
        private readonly ChatRepository $chatRepository,
        private readonly DocumentRepository $documentRepository,
        private readonly PageRepository $pageRepository,
    ) {
    }

    /**
     * @param string $question 質問
     * @param string $documentName 使用するドキュメント名
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    public function execute(string $question, string $documentName): array
    {
        $responseFromGptEngine = $this->getAnswerFromGptEngine();

        if ($responseFromGptEngine["status"] !== SymfonyResponse::HTTP_OK) {
            ['status' => $status, 'message' => $errorMessage] = $responseFromGptEngine;

            throw new GptEngineProcessException(message: $errorMessage, code: $status);
        }

        ['answer' => $answer, 'pdf_pages' => $pdfPages] = $responseFromGptEngine;

        DB::transaction(function () use ($question, $documentName, $answer, $pdfPages) {
            $document = $this->documentRepository->firstOrFailByDocumentName($documentName);

            $storeChatParams = $this->makeStoreChatParams($question, $answer, $document->id);

            Log::info('[Start] チャットの保存処理を開始します。', [
                'method' => __METHOD__,
                'question' => $question,
                'user_id' => $userId ?? null,
            ]);

            $chat = $this->chatRepository->store($storeChatParams);

            $insertPageParams = $this->makeInsertPageParams($pdfPages, $chat->id);

            Log::info('[Start] ページの保存処理を開始します。', [
                'method' => __METHOD__,
                'chat_id' => $chat->id,
                'user_id' => $userId ?? null,
                'pages' => $pdfPages,
            ]);

            $this->pageRepository->insert($insertPageParams);

            Log::info('[End] チャットとページの保存処理が完了しました。', [
                'method' => __METHOD__,
                'question' => $question,
                'chat_id' => $chat->id,
                'user_id' => $userId ?? null,
            ]);
        });

        return ['answer' => $answer, 'pdfPages' => $pdfPages];
    }

    /**
     * gpt_engine から回答を取得
     *
     * @return \Illuminate\Http\Client\Response
     */
    private function getAnswerFromGptEngine(): Response
    {
        return Http::timeout(-1)->get('http://gpt_engine:8000/hello');
    }

    /**
     * チャットを保存するためのオブジェクト作成
     *
     * @param string $question
     * @param string $answer
     * @param string $documentId
     *
     * @return StoreChatParams
     */
    private function makeStoreChatParams($question, $answer, $documentId): StoreChatParams
    {
        return
            new StoreChatParams(
                question: $question,
                questionTokenCount: 12,
                answer: $answer,
                answerTokenCount: 28,
                date: CarbonImmutable::now(),
                userId: null,
                documentId: $documentId,
            );
    }

    /**
     * ページ配列をinsertするためのオブジェクト作成
     *
     * @param array $pdfPages
     * @param string $chatId
     *
     * @return array
     */
    private function makeInsertPageParams($pdfPages, $chatId): array
    {
        $insertPageParams = [];

        foreach ($pdfPages as $pdfPage) {
            $storePageParams =
                new StorePageParams(
                    id: strtolower((string) Str::ulid()),
                    page: $pdfPage,
                    chatId: $chatId,
                    createdAt: CarbonImmutable::now(),
                    updatedAt: CarbonImmutable::now(),
                    deletedAt: null,
                );

            $insertPageParams[] = $storePageParams->toArrayForInsert();
        }
        return $insertPageParams;
    }
}
