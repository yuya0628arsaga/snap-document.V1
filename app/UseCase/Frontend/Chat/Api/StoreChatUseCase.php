<?php

declare(strict_types=1);

namespace App\UseCase\Frontend\Chat\Api;

use App\Repositories\Frontend\Chat\ChatRepository;
use App\Repositories\Frontend\Chat\Params\StoreChatParams;
use App\Repositories\Frontend\Document\DocumentRepository;
use App\Repositories\Frontend\Page\PageRepository;
use App\Repositories\Frontend\Page\Params\StorePageParams;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;

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
    public function execute(string $question, string $documentName): array
    {
        // $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');

        Sleep::sleep(2);
        $a = rand();
        $res = [
            'answer' => $a.'コンテナが初めて起動されると、指定された名前の新しいデータベースが作成され、提供された構成変数で初期化されます。さらに、/docker-entrypoint-initdb.dにある拡張子.sh、.sql、.sql.gzのファイルがアルファベット順に実行されます。このディレクトリにSQLダンプをマウントすることで、簡単にmysqlサービスにデータを入れることができます。SQLファイルはデフォルトではMYSQL_DATABASE変数で指定されたデータベースにインポートされます。」'
        ];

        $document = $this->documentRepository->firstOrFailByDocumentName($documentName);

        Log::debug($document);

        $storeChatParams =
            new StoreChatParams(
                question: $question,
                questionTokenCount: 12,
                // 'answer' => $res["answer"],
                answer: '回答回答回答',
                answerTokenCount: 28,
                date: CarbonImmutable::now(),
                userId: null,
                documentId: $document->id,
            );

        $chat = $this->chatRepository->create($storeChatParams);

        Log::debug($chat);


        // $pages = $res["pdf_pages"];
        $pages = [1, 2, 3];
        foreach ($pages as $page) {
            $storePageParams =
                new StorePageParams(
                    page: $page,
                    chatId: $chat->id,
                );
            $this->pageRepository->create($storePageParams);
        }

        return $res;
    }
}
