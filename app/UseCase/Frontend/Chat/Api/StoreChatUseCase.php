<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Exceptions\GptEngineProcessException;
use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use App\Repositories\Frontend\ChatGroup\ChatGroupRepository;
use App\Repositories\Frontend\ChatGroup\Params\StoreChatGroupParams;
use App\Repositories\Frontend\ChatGroup\Params\UpdateChatGroupParams;
use App\Repositories\Frontend\ChatImage\ChatImageRepository;
use App\Repositories\Frontend\ChatImage\Params\StoreChatImageParams;
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
     * @param ChatImageRepository $chatImageRepository
     */
    public function __construct(
        private readonly ChatGroupRepository $chatGroupRepository,
        private readonly ChatRepository $chatRepository,
        private readonly DocumentRepository $documentRepository,
        private readonly PageRepository $pageRepository,
        private readonly ChatImageRepository $chatImageRepository
    ) {
    }

    /**
     * @param string $question 質問
     * @param string $documentName 使用するドキュメント名
     * @param array $chatHistory チャット履歴
     * @param ?string $chatGroupId チャットグループID
     * @param bool $isGetPdfPage PDFページ取得フラグ
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    public function execute(string $question, string $documentName, array $chatHistory, ?string $chatGroupId, bool $isGetPdfPage): array
    {
        [$answer, $pdfPages, $tokenCounts, $cost] = $this->getAnswerFromGptEngine($question, $documentName, $chatHistory, $isGetPdfPage);

        [$chatGroupId, $imageDatum] = DB::transaction(function () use ($question, $documentName, $answer, $pdfPages, $tokenCounts, $cost, $chatGroupId) {
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

            Log::info('[Start] ページの保存処理を開始します。', [
                'method' => __METHOD__,
                'chat_id' => $chat->id,
                'user_id' => $userId ?? null,
                'pages' => $pdfPages,
            ]);

            $insertPageParams = $this->makeInsertPageParams($pdfPages, $chat->id);
            $this->pageRepository->insert($insertPageParams);

            $imageDatum = $this->makeImageDatum($answer, $documentName);

            Log::info('[Start] 画像情報の保存処理を開始します。', [
                'method' => __METHOD__,
                'chat_id' => $chat->id,
                'user_id' => $userId ?? null,
                'imageDatum' => $imageDatum,
            ]);

            $insertChatImageParams = $this->makeInsertChatImageParams($imageDatum, $chat->id);
            $this->chatImageRepository->insert($insertChatImageParams);

            Log::info('[End] チャット, ページ, 画像の保存処理が完了しました。', [
                'method' => __METHOD__,
                'question' => $question,
                'chat_id' => $chat->id,
                'user_id' => $userId ?? null,
            ]);

            return [$chatGroupId, $imageDatum];
        });

        return [
            'answer' => $answer,
            'images' => $imageDatum,
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
     * @param bool $isGetPdfPage
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    private function getAnswerFromGptEngine(string $question, string $documentName, array $chatHistory, bool $isGetPdfPage): array
    {
        $responseFromGptEngine =
            Http::timeout(-1)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post(config('api.gpt_engine.endpoint').'/test3', [
                'question' => $question,
                'document_name' => $documentName,
                'chat_history' => $chatHistory,
                'is_get_pdf_page' => $isGetPdfPage,
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

    /**
     * 画像情報のデータ作成
     *
     * @param string $answer
     * @param string $documentName
     *
     * @return array
     */
    private function makeImageDatum(string $answer, string $documentName): array
    {
        $imageNames = $this->getImageNamesFromAnswer($answer);
        Log::debug($imageNames);

        return array_map(function ($imageName) use ($documentName) {
            Log::debug($imageName);
            Log::debug($documentName);
            return [
                'name' => $imageName,
                'url' => $this->getImageUrl($documentName, $imageName),
            ];
        }, $imageNames);
    }

    /**
     * 画像が保存されてるS3のURLを取得
     *
     * @param string $documentName
     * @param string $fileName
     *
     * @return string
     */
    private function getImageUrl(string $documentName, string $fileName): string
    {
        $BUCKET = config('filesystems.disks.s3.bucket');
        $REGION = config('filesystems.disks.s3.region');

        // https://{bucket-name}.s3.{region}.amazonaws.com/{folder-name}/{file-name}
        return 'https://'.$BUCKET.'.s3.'.$REGION.'.amazonaws.com/'.$documentName.'/'.$fileName;
    }

    /**
     * 回答内から画像名を取得
     *
     * @param string $answer
     *
     * @return array
     */
    private function getImageNamesFromAnswer(string $answer): array
    {
        /**
         * TODO::「図33」のように画像名が「図〇〇」（〇〇は数値）の場合のみしか取得できないため、
         * 「画像12」や「図A」のような場合にも取得できるように一般化する必要あり
         */
        $prefixImageName = '図';
        preg_match_all('/'.$prefixImageName.'\d+/i', $answer, $matches);

        return $matches[0];
    }

    /**
     * 画像データの配列をinsertするためのオブジェクト作成
     *
     * @param array $imageDatum
     * @param string $chatId
     *
     * @return array
     */
    private function makeInsertChatImageParams($imageDatum, $chatId): array
    {
        $insertChatImageParams = [];

        foreach ($imageDatum as $imageData) {
            $storeChatImageParams =
                new StoreChatImageParams(
                    id: strtolower((string) Str::ulid()),
                    name: $imageData['name'],
                    url: $imageData['url'],
                    chatId: $chatId,
                    createdAt: CarbonImmutable::now(),
                    updatedAt: CarbonImmutable::now(),
                    deletedAt: null,
                );

            $insertChatImageParams[] = $storeChatImageParams->toArrayForInsert();
        }
        return $insertChatImageParams;
    }
}
