<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Enums\GptEngineStatus;
use App\Exceptions\GptEngineProcessException;
use App\Http\Controllers\Frontend\Chat\Api\Params\ChatParams;
use App\Models\Chat;
use App\Models\ChatGroup;
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
use App\Services\Frontend\Auth\AuthUserGetter;
use App\Services\GptEngineConnectionInterface;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreChatUseCase
{
    /**
     * @param ChatGroupRepository $chatGroupRepository
     * @param ChatRepository $chatRepository
     * @param DocumentRepository $documentRepository
     * @param PageRepository $pageRepository
     * @param ChatImageRepository $chatImageRepository
     * @param GptEngineConnectionInterface $gptEngineConnection
     */
    public function __construct(
        private readonly ChatGroupRepository $chatGroupRepository,
        private readonly ChatRepository $chatRepository,
        private readonly DocumentRepository $documentRepository,
        private readonly PageRepository $pageRepository,
        private readonly ChatImageRepository $chatImageRepository,
        private readonly GptEngineConnectionInterface $gptEngineConnection,
    ) {
    }

    /**
     * @param ?string $chatGroupId チャットグループID
     * @param ChatParams $chatParams
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    public function execute(?string $chatGroupId, ChatParams $chatParams): array
    {
        [$answer, $pdfPages, $tokenCounts, $cost] = $this->getAnswerFromGptEngine($chatParams);
        $question = $chatParams->getQuestion();
        $documentName = $chatParams->getDocumentName();

        [$chatGroupId, $imageDatum] = DB::transaction(function () use (
            $question,
            $documentName,
            $answer,
            $pdfPages,
            $tokenCounts,
            $cost,
            $chatGroupId,
        ) {
            $userId = AuthUserGetter::get()->id;
            $chatGroup = $chatGroupId
                ? $this->updateChatGroup($userId, $chatGroupId)
                : $this->storeChatGroup($userId);

            $chatGroupId = $chatGroup->id;
            $document = $this->documentRepository->firstOrFailByDocumentName($documentName);

            // チャット保存
            $chat = $this->storeChat($question, $answer, $document->id, $tokenCounts, $cost, $chatGroupId, $userId);

            // ページ保存
            $this->storePages($userId, $chat->id, $pdfPages);

            // 画像保存
            $imageDatum = $this->makeImageDatum($answer, $documentName);
            $this->storeChatImages($userId, $chatGroupId, $imageDatum);

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
     * @param ChatParams $chatParams
     *
     * @throws \App\Exceptions\GptEngineProcessException
     *
     * @return array
     */
    private function getAnswerFromGptEngine(ChatParams $chatParams): array
    {
        $responseFromGptEngine = $this->gptEngineConnection::post(
            url: '/chat/answer/',
            params: $chatParams->toArray()
        );

        if ($responseFromGptEngine['status'] !== GptEngineStatus::HTTP_OK->value) {
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
     * チャットグループの保存処理
     *
     * @param string $userId
     *
     * @return ChatGroup
     */
    private function storeChatGroup(string $userId): ChatGroup
    {
        Log::info('[Start] チャットグループの保存処理を開始します。', [
            'method' => __METHOD__,
            'user_id' => $userId,
        ]);

        $title = '質問_'.((string) Str::uuid());
        $lastChatDate = $this->getCurrentTime();

        $storeChatGroupParams = $this->makeStoreChatGroupParams($title, $lastChatDate, $userId);
        $chatGroup = $this->chatGroupRepository->store($storeChatGroupParams);

        Log::info('[End] チャットグループの保存処理が完了しました。', [
            'method' => __METHOD__,
            'user_id' => $userId,
        ]);

        return $chatGroup;
    }

    /**
     * チャットグループの更新処理
     *
     * @param string $userId
     * @param string $chatGroupId
     *
     * @return ChatGroup
     */
    private function updateChatGroup(string $userId, string $chatGroupId): ChatGroup
    {
        Log::info('[Start] チャットグループの更新処理を開始します。', [
            'method' => __METHOD__,
            'chat_group_id' => $chatGroupId,
            'user_id' => $userId,
        ]);

        $lastChatDate = $this->getCurrentTime();
        $params = new UpdateChatGroupParams(
            lastChatDate: $lastChatDate
        );

        $chatGroup = $this->chatGroupRepository->update($chatGroupId, $params);

        Log::info('[End] チャットグループの更新処理が完了しました', [
            'method' => __METHOD__,
            'chat_group_id' => $chatGroupId,
            'user_id' => $userId,
        ]);

        return $chatGroup;
    }

    /**
     * チャットグループを保存するためのオブジェクト作成
     *
     * @param string $title
     * @param CarbonImmutable $lastChatDate
     * @param string $userId
     *
     * @return StoreChatGroupParams
     */
    private function makeStoreChatGroupParams(string $title, CarbonImmutable $lastChatDate, string $userId): StoreChatGroupParams
    {
        return
            new StoreChatGroupParams(
                title: $title,
                lastChatDate: $lastChatDate,
                userId: $userId,
            );
    }

    /**
     * チャットの保存処理
     *
     * @param string $question
     * @param string $answer
     * @param string $documentId
     * @param array $tokenCounts
     * @param float $cost
     * @param string $chatGroupId
     * @param string $userId
     *
     * @return Chat
     */
    private function storeChat(
        string $question,
        string $answer,
        string $documentId,
        array $tokenCounts,
        float $cost,
        string $chatGroupId,
        string $userId
    ): Chat {
        Log::info('[Start] チャットの保存処理を開始します。', [
            'method' => __METHOD__,
            'question' => $question,
            'user_id' => $userId,
        ]);

        $storeChatParams = $this->makeStoreChatParams($question, $answer, $documentId, $tokenCounts, $cost, $chatGroupId, $userId);
        $chat = $this->chatRepository->store($storeChatParams);

        Log::info('[End] チャットの保存処理が完了しました。', [
            'method' => __METHOD__,
            'question' => $question,
            'user_id' => $userId,
        ]);

        return $chat;
    }

    /**
     * チャットを保存するためのオブジェクト作成
     *
     * @param string $question
     * @param string $answer
     * @param string $documentId
     * @param array $tokenCounts
     * @param float $cost
     * @param string $chatGroupId
     * @param string $userId
     *
     * @return StoreChatParams
     */
    private function makeStoreChatParams(
        string $question,
        string $answer,
        string $documentId,
        array $tokenCounts,
        float $cost,
        string $chatGroupId,
        string $userId
    ): StoreChatParams {
        return
            new StoreChatParams(
                date: $this->getCurrentTime(),
                question: $question,
                answer: $answer,
                questionTokenCount: $tokenCounts['promptTokens'],
                answerTokenCount: $tokenCounts['completionTokens'],
                cost: $cost,
                userId: $userId,
                documentId: $documentId,
                chatGroupId: $chatGroupId,
            );
    }

    /**
     * ページの保存処理
     *
     * @param string $userId
     * @param string $chatId
     * @param array $pdfPages
     *
     * @return void
     */
    private function storePages(string $userId, string $chatId, array $pdfPages): void
    {
        Log::info('[Start] ページの保存処理を開始します。', [
            'method' => __METHOD__,
            'chat_id' => $chatId,
            'user_id' => $userId,
            'pages' => $pdfPages,
        ]);

        $insertPageParams = $this->makeInsertPageParams($pdfPages, $chatId);
        $this->pageRepository->insert($insertPageParams);

        Log::info('[End] ページの保存処理が完了しました。', [
            'method' => __METHOD__,
            'chat_id' => $chatId,
            'user_id' => $userId,
            'pages' => $pdfPages,
        ]);
    }

    /**
     * ページ配列をinsertするためのオブジェクト作成
     *
     * @param array $pdfPages
     * @param string $chatId
     *
     * @return array
     */
    private function makeInsertPageParams(array $pdfPages, string $chatId): array
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
     * 今の日時を取得
     *
     * @return CarbonImmutable
     */
    private function getCurrentTime(): CarbonImmutable
    {
        return CarbonImmutable::now();
    }

    /**
     * 画像の保存処理
     *
     * @param string $userId
     * @param string $chatId
     * @param array $imageDatum
     *
     * @return void
     */
    private function storeChatImages(string $userId, string $chatId, array $imageDatum): void
    {
        Log::info('[Start] 画像情報の保存処理を開始します。', [
            'method' => __METHOD__,
            'chat_id' => $chatId,
            'user_id' => $userId,
            'imageDatum' => $imageDatum,
        ]);

        $insertChatImageParams = $this->makeInsertChatImageParams($imageDatum, $chatId);
        $this->chatImageRepository->insert($insertChatImageParams);

        Log::info('[End] 画像情報の保存処理が完了しました。', [
            'method' => __METHOD__,
            'chat_id' => $chatId,
            'user_id' => $userId,
            'imageDatum' => $imageDatum,
        ]);
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

        return array_map(function ($imageName) use ($documentName) {
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
    private function makeInsertChatImageParams(array $imageDatum, string $chatId): array
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
