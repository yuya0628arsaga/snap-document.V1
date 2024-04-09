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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;
use Throwable;

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
     * @throws \Throwable
     *
     * @return array
     */
    public function execute(string $question, string $documentName)
    {
            $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');

            if ($res["status"] !== 200) {
                ['status' => $status, 'message' => $errorMessage] = $res;
                throw new GptEngineProcessException(message: $errorMessage, code: $status);
            }

            // Sleep::sleep(2);
            // $a = rand();
            // $res = [
            //     'answer' => $a.'コンテナが初めて起動されると、指定された名前の新しいデータベースが作成され、提供された構成変数で初期化されます。さらに、/docker-entrypoint-initdb.dにある拡張子.sh、.sql、.sql.gzのファイルがアルファベット順に実行されます。このディレクトリにSQLダンプをマウントすることで、簡単にmysqlサービスにデータを入れることができます。SQLファイルはデフォルトではMYSQL_DATABASE変数で指定されたデータベースにインポートされます。」'
            // ];

            ['answer' => $answer, 'pdf_pages' => $pdfPages] = $res;

            DB::transaction(function () use ($question, $documentName, $answer, $pdfPages) {
                $document = $this->documentRepository->firstOrFailByDocumentName($documentName);

                $storeChatParams =
                    new StoreChatParams(
                        question: $question,
                        questionTokenCount: 12,
                        answer: $answer,
                        answerTokenCount: 28,
                        date: CarbonImmutable::now(),
                        userId: null,
                        documentId: $document->id,
                    );

                Log::info('[Start] チャットの保存処理を開始します。', [
                    'method' => __METHOD__,
                    'question' => $question,
                    'user_id' => $userId ?? null,
                ]);

                $chat = $this->chatRepository->create($storeChatParams);

                foreach ($pdfPages as $pdfPage) {
                    $storePageParams =
                        new StorePageParams(
                            page: $pdfPage,
                            chatId: $chat->id,
                        );

                    Log::info('[Start] ページの保存処理を開始します。', [
                        'method' => __METHOD__,
                        'chat_id' => $chat->id,
                        'user_id' => $userId ?? null,
                    ]);

                    // TODO::ここ insert で一括createできない？
                    $this->pageRepository->create($storePageParams);
                }

                Log::info('[End] チャットとページの保存処理が完了しました。', [
                    'method' => __METHOD__,
                    'question' => $question,
                    'chat_id' => $chat->id,
                    'user_id' => $userId ?? null,
                ]);
            });

            return $res;
    }
}
