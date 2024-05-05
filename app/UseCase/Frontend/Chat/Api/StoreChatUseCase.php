<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Exceptions\GptEngineProcessException;
use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Repositories\Frontend\ChatGroup\Params\StoreChatGroupParams;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use App\Repositories\Frontend\Document\DocumentRepository;
use App\Repositories\Frontend\Page\PageRepository;
use App\Repositories\Frontend\Page\Params\StorePageParams;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class StoreChatUseCase
{
    /**
     * @param ChatGroupRepository $chatGroupRepository
     * @param ChatRepository $chatRepository
     * @param DocumentRepository $documentRepository
     * @param PageRepository $pageRepository
     */
    public function __construct(
        private readonly ChatGroupRepository $chatGroupRepository,
        private readonly ChatRepository $chatRepository,
        private readonly DocumentRepository $documentRepository,
        private readonly PageRepository $pageRepository,
    ) {
    }

    /**
     * @param string $question 質問
     * @param string $documentName 使用するドキュメント名
     * @param array $chatHistory チャット履歴
     * @param ?string $chatGroupId
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    public function execute(string $question, string $documentName, array $chatHistory, ?string $chatGroupId): array
    {
        [$answer, $base64Images, $pdfPages, $tokenCounts, $cost] = $this->getAnswerFromGptEngine($question, $documentName, $chatHistory);

        $chatGroupId = DB::transaction(function () use ($question, $documentName, $answer, $pdfPages, $tokenCounts, $cost, $chatGroupId) {
            $document = $this->documentRepository->firstOrFailByDocumentName($documentName);

            if (! $chatGroupId) {
                // chatGroupの中で初めての質問の場合
                Log::info('[Start] チャットグループの保存処理を開始します。', [
                    'method' => __METHOD__,
                    'user_id' => $userId ?? null,
                ]);

                $title = '質問_'.((string) Str::uuid());
                $lastChatDate = $this->getCurrentTime();

                $storeChatGroupParams = $this->makeStoreChatGroupParams($title, $lastChatDate);
                $chatGroup = $this->chatGroupRepository->store($storeChatGroupParams);
                $chatGroupId = $chatGroup->id;
            } else {
                // chatGroupの中で２回目以降の質問の場合
                Log::info('[Start] チャットグループの更新処理を開始します。', [
                    'method' => __METHOD__,
                    'chat_group_id' => $chatGroupId,
                    'user_id' => $userId ?? null,
                ]);

                $lastChatDate = $this->getCurrentTime();
                $params = new UpdateChatGroupParams(
                    lastChatDate: $lastChatDate
                );
                $this->chatGroupRepository->update($chatGroupId, $params);
            }

            Log::info('[Start] チャットの保存処理を開始します。', [
                'method' => __METHOD__,
                'question' => $question,
                'user_id' => $userId ?? null,
            ]);

            $storeChatParams = $this->makeStoreChatParams($question, $answer, $document->id, $tokenCounts, $cost, $chatGroupId);

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

            return $chatGroupId;
        });

        return [
            'answer' => $answer,
            'base64Images' => $base64Images,
            'pdfPages' => $pdfPages,
            'chatGroupId' => $chatGroupId,
        ];
    }

    /**
     * gpt_engine から回答を取得
     *
     * @param string $question
     * @param string $documentName
     * @param array $chatHistory
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    private function getAnswerFromGptEngine(string $question, string $documentName, array $chatHistory): array
    {
        $responseFromGptEngine =
            Http::timeout(-1)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post(config('api.gpt_engine.endpoint').'/test3', [
                'question' => $question,
                'document_name' => $documentName,
                'chat_history' => $chatHistory,
            ]);

        if ($responseFromGptEngine['status'] !== Response::HTTP_OK) {
            ['status' => $status, 'message' => $errorMessage] = $responseFromGptEngine;

            throw new GptEngineProcessException(message: $errorMessage, code: $status);
        };

        $tokenCounts = [
            'promptTokens' => $responseFromGptEngine['token_counts']['prompt_tokens'],
            'completionTokens' => $responseFromGptEngine['token_counts']['completion_tokens'],
        ];

        return [
            $responseFromGptEngine['answer'],
            $responseFromGptEngine['base64_images'],
            $responseFromGptEngine['pdf_pages'],
            $tokenCounts,
            $responseFromGptEngine['cost'],
        ];
    }

    /**
     * チャットを保存するためのオブジェクト作成
     *
     * @param string $question
     * @param string $answer
     * @param string $documentId
     * @param array $tokenCounts
     * @param string $chatGroupId
     *
     * @return StoreChatParams
     */
    private function makeStoreChatParams($question, $answer, $documentId, $tokenCounts, $cost, $chatGroupId): StoreChatParams
    {
        return
            new StoreChatParams(
                date: $this->getCurrentTime(),
                question: $question,
                answer: $answer,
                questionTokenCount: $tokenCounts['promptTokens'],
                answerTokenCount: $tokenCounts['completionTokens'],
                cost: $cost,
                userId: null,
                documentId: $documentId,
                chatGroupId: $chatGroupId,
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

    /**
     * チャットグループを保存するためのオブジェクト作成
     *
     * @param string $title
     * @param CarbonImmutable $lastChatDate
     *
     * @return StoreChatGroupParams
     */
    private function makeStoreChatGroupParams(string $title, CarbonImmutable $lastChatDate): StoreChatGroupParams
    {
        return
            new StoreChatGroupParams(
                title: $title,
                lastChatDate: $lastChatDate,
            );
    }

    /**
     * 今の日時を取得
     *
     * @return CarbonImmutable
     */
    private function getCurrentTime(): CarbonImmutable
    {
        return CarbonImmutable::now();
    }
}
