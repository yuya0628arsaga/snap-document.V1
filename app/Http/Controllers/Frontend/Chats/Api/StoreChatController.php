<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Chats\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Document;
use App\Models\Page;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StoreChatController extends Controller
{
    public function __construct()
    {
    }

    public function __invoke()
    {
        $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');
        // Log::debug($res);
        // Log::debug($res["answer"]);
        // Log::debug(gettype($res["answer"]));
        // Log::debug(gettype($res["pdf_pages"]));


        $document = Document::where('name', '=', 'Man_Digest_v9')->firstOrFail();

        Log::debug($document);
        Log::debug($document->id);

        $chat =
            Chat::create([
                'question' => 'aaa',
                'question_token_count' => 12,
                'answer' => $res["answer"],
                'answer_token_count' => 28,
                'date' => CarbonImmutable::now(),
                'document_id' => $document->id,
            ]);

        Log::debug($chat);
        $pages = $res["pdf_pages"];
        foreach ($pages as $page) {
            Page::create([
                'page' => $page,
                'chat_id' => $chat->id,
            ]);
        }
        // return $res;
        $a = rand();
        return $res;
        // return [
        //     'message' => $a.'name will be created and initialized with the provided configuration variables. Furthermore, it will execute files with extensions .sh, .sql and .sql.gz that are found in /docker-entrypoint-initdb.d. Files will be executed in alphabetical order. You can easily populate your mysql services by mounting a SQL dump into that directory and provide custom images with contributed data. SQL files will be imported by default to the database specified by the MYSQL_DATABASE variable.

        //     「コンテナが初めて起動されると、指定された名前の新しいデータベースが作成され、提供された構成変数で初期化されます。さらに、/docker-entrypoint-initdb.dにある拡張子.sh、.sql、.sql.gzのファイルがアルファベット順に実行されます。このディレクトリにSQLダンプをマウントすることで、簡単にmysqlサービスにデータを入れることができます。SQLファイルはデフォルトではMYSQL_DATABASE変数で指定されたデータベースにインポートされます。」'];
    }
}
