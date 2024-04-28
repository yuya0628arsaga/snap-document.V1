<?php

declare(strict_types=1);

use App\Http\Controllers\Frontend\Chat\Api\StoreChatController;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;

/*
|--------------------------------------------------------------------------
| User API Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('chats')->name('chat.')->group(function () {
    Route::post('/', StoreChatController::class)->name('store');
});

Route::get('/test-api', function() {
    Log::debug('apiのtest/');
    return response()->json('test-api成功', 200);
});

Route::get('/test-api2', function() {
    Log::debug('apiのtest2/');
    $res = Http::timeout(-1)->get(config('api.gpt_engine.endpoint').'/hello');
    Log::debug($res);
    return $res;
});

Route::get('/test-api3', function() {
    Log::debug('apiのtest3/');
    $res = DB::table('chats')->get();
    Log::debug($res);
    return 'DB接続成功: '.$res->collect();
});

Route::post('/test-api4', function(Request $request) {
    Log::debug('apiのtest4/');
    Log::debug($request->input('testParam'));
    $res = Http::timeout(-1)->get(config('api.gpt_engine.endpoint').'/hello');
    Log::debug($res);
    return 'レスポンンス: '.$res.', パラメータ:'.$request->input('testParam');
});

Route::get('/test-api5', function() {
    Log::debug('apiのtest5/');
    $res = Http::timeout(-1)->withHeaders([
        'Content-Type' => 'application/json',
    ])->post(config('api.gpt_engine.endpoint').'/chat/answer', [
        'question' => 'Sパラメータ解析のやり方は？',
        'document_name' => 'Man_Digest_v9',
        'chat_history' => [],
    ]);
    Log::debug($res);
    return 'レスポンンス: '.$res;
});


// Route::post('/question', function (Request $request) {
//     $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');
//     Log::debug($res->json());
//     return $res;
//     // $resp = $resp->json();
//     // Log::debug($resp->json());

//     // $resp = ["message" => 9999];
//     // $json = json_encode($resp, JSON_PRETTY_PRINT);
//     // Log::debug($resp);
//     // return response()->json($resp);
//     // return response()->json(1111);
// });

// Route::get('/tes', function (Request $request) {
//     $res = Http::timeout(-1)->get('http://gpt_engine:8000/hello');
//     Log::debug($res->json());
//     return $res;
//     // $resp = $resp->json();
//     // Log::debug($resp->json());

//     // $resp = ["message" => 9999];
//     // $json = json_encode($resp, JSON_PRETTY_PRINT);
//     // Log::debug($resp);
//     // return response()->json($resp);
//     // return response()->json(1111);
// });

Route::get('/test', function (Request $request) {
    Sleep::sleep(1);
    Log::debug('停止');
    $a = rand();
    return [
        'message' => $a.'name will be created and initialized with the provided configuration variables. Furthermore, it will execute files with extensions .sh, .sql and .sql.gz that are found in /docker-entrypoint-initdb.d. Files will be executed in alphabetical order. You can easily populate your mysql services by mounting a SQL dump into that directory and provide custom images with contributed data. SQL files will be imported by default to the database specified by the MYSQL_DATABASE variable.

        「コンテナが初めて起動されると、指定された名前の新しいデータベースが作成され、提供された構成変数で初期化されます。さらに、/docker-entrypoint-initdb.dにある拡張子.sh、.sql、.sql.gzのファイルがアルファベット順に実行されます。このディレクトリにSQLダンプをマウントすることで、簡単にmysqlサービスにデータを入れることができます。SQLファイルはデフォルトではMYSQL_DATABASE変数で指定されたデータベースにインポートされます。」'];
});

Route::get('/test1', function (Request $request) {
    Document::create([
        'name' => 'Man_Digest_v9',
        'extension' => 'pdf',
        'url' => 'https://mel-document-public.s3.ap-northeast-1.amazonaws.com',
    ]);
});
