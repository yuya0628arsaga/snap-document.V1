<?php

namespace Tests\Feature\Backend\Chroma;

use App\Enums\GptEngineStatus;
use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Tests\Feature\Mock\GptEngineConnectionMock;

class StoreChromaTest extends TestCase
{
    use RefreshDatabase;

    /** @var Document */
    private Document $document;

    /** @var GptEngineConnectionMock */
    private GptEngineConnectionMock $gptEngineConnectionMock;

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->document = Document::factory()->create();

        $this->gptEngineConnectionMock = new GptEngineConnectionMock();
    }

    /**
     * 正常系
     */
    public function test_store_chroma(): void
    {
        $responseFromGptEngine = $this->makeResponseFromGptEngine(GptEngineStatus::HTTP_OK->value);
        $this->gptEngineConnectionMock->post($responseFromGptEngine);

        $requestParams = $this->makeRequestParams(documentName: $this->document->name);
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_OK)
            ->assertJson([
                'message' => 'PDFのページごとに保存成功',
            ]);
    }

    /**
     * 異常系 - gpt_engineで例外が発生した場合、GptEngineProcessExceptionが返る
     */
    public function test_store_chroma_when_gpt_engine_exception(): void
    {
        $responseFromGptEngine = $this->makeResponseFromGptEngine(GptEngineStatus::HTTP_INTERNAL_SERVER_ERROR->value);
        $this->gptEngineConnectionMock->post($responseFromGptEngine);

        $requestParams = $this->makeRequestParams(documentName: $this->document->name);
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_INTERNAL_SERVER_ERROR)
            ->assertJson([
                'status' => SymfonyResponse::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'gpt_engine Internal Server Error',
                'errors' => [],
            ]);
    }

    /**
     * 異常系 - 存在しないドキュメントを指定した場合、422エラーが出る
     */
    public function test_store_chroma_when_document_not_exist(): void
    {
        $responseFromGptEngine = $this->makeResponseFromGptEngine(GptEngineStatus::HTTP_OK->value);
        $this->gptEngineConnectionMock->post($responseFromGptEngine);

        $requestParams = $this->makeRequestParams(documentName: 'wrong-document-name');
        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * リクエストパラメータの作成
     *
     * @param ?string $documentName
     *
     * @return array
     */
    private function makeRequestParams($documentName): array
    {
        return [
            'documentName' => $documentName
        ];
    }

    /**
     * gpt_engineからのレスポンス作成
     *
     * @param int $status
     *
     * @return array
     */
    private function makeResponseFromGptEngine(int $status): array
    {
        return
            $status === GptEngineStatus::HTTP_OK->value
            ? [
                'status' => $status,
                'message' => 'PDFのページごとに保存成功',
            ]
            : [
                'status' => $status,
                'message' => 'gpt_engine Internal Server Error',
                'errors' => [],
            ];
    }

    /**
     * テスト共通処理
     *
     * @param array $requestParams
     *
     * @return TestResponse
     */
    private function commonExecution(array $requestParams): TestResponse
    {
        return $this->post(route('api.admin.chroma'), $requestParams);
    }
}
