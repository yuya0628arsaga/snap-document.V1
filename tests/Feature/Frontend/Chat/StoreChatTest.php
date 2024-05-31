<?php

namespace Tests\Feature\Frontend\Chat;

use App\Models\ChatGroup;
use App\Models\Document;
use App\Models\User;
use App\Services\GptEngineConnection;
use App\Services\GptEngineConnectionInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;
use Mockery as m;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class StoreChatTest extends TestCase
{
    use RefreshDatabase;

    /** @var string */
    static private string $guard = 'web';

    /** @var User */
    private User $user;

    /** @var Document */
    private Document $document;

    /** @var ChatGroup */
    private ChatGroup $chatGroup;

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->document = Document::factory()->create();
        $this->chatGroup = ChatGroup::factory()->create();
    }

    /**
     * 正常系 - chatGroupIdが既に存在する場合（2回目以降の質問）
     */
    public function test_store_chat_success(): void
    {
        $requestParams = $this->makeRequestParams(chatGroupId: $this->chatGroup->id);
        $responseFromGptEngine = $this->makeResponseFromGptEngine();

        $this->setGptEngineConnectionMock($responseFromGptEngine);

        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_CREATED)
            ->assertJson([
                'answer' => $responseFromGptEngine['answer'],
                'images' => [],
                'pdfPages' => $responseFromGptEngine['pdf_pages'],
                'chatGroupId' => $requestParams['chatGroupId'],
            ]);

        $this->assertDatabaseHas('chats', [
            'question' => $requestParams['question'],
            'answer' => $responseFromGptEngine['answer'],
            'question_token_count' => $responseFromGptEngine['token_counts']['prompt_tokens'],
            'answer_token_count' => $responseFromGptEngine['token_counts']['completion_tokens'],
            'cost' => $responseFromGptEngine['cost'],
            'chat_group_id' => $requestParams['chatGroupId'],
        ]);

        foreach ($responseFromGptEngine['pdf_pages'] as $pdfPage) {
            $this->assertDatabaseHas('pages', [
                'page' => $pdfPage,
            ]);
        }
    }

    /**
     * 正常系 - chatGroupIdがnullの場合（1回目の質問）
     */
    public function test_store_chat_success_when_chat_group_id_is_null(): void
    {
        $requestParams = $this->makeRequestParams(chatGroupId: null);
        $responseFromGptEngine = $this->makeResponseFromGptEngine();

        $this->setGptEngineConnectionMock($responseFromGptEngine);

        $response = $this->commonExecution($requestParams);

        $chatGroupId = ChatGroup::latest()->first()->id;

        $response->assertStatus(SymfonyResponse::HTTP_CREATED)
            ->assertJson([
                'answer' => $responseFromGptEngine['answer'],
                'images' => [],
                'pdfPages' => $responseFromGptEngine['pdf_pages'],
                'chatGroupId' => $chatGroupId,
            ]);

        $this->assertDatabaseHas('chats', [
            'question' => $requestParams['question'],
            'answer' => $responseFromGptEngine['answer'],
            'question_token_count' => $responseFromGptEngine['token_counts']['prompt_tokens'],
            'answer_token_count' => $responseFromGptEngine['token_counts']['completion_tokens'],
            'cost' => $responseFromGptEngine['cost'],
            'chat_group_id' => $chatGroupId,
        ]);

        foreach ($responseFromGptEngine['pdf_pages'] as $pdfPage) {
            $this->assertDatabaseHas('pages', [
                'page' => $pdfPage,
            ]);
        }
    }

    /**
     * storeChatへのリクエストパラメータ作成
     *
     * @param ?string $chatGroupId
     *
     * @return array
     */
    private function makeRequestParams(?string $chatGroupId): array
    {
        return [
            'question' => '質問テスト',
            'manualName' => $this->document->name,
            'chatHistory' => [],
            'chatGroupId' => $chatGroupId,
            'isGetPdfPage' => false,
            'gptModel' => 'gpt-3.5-turbo',
        ];
    }

    /**
     * gpt_engineからのレスポンス作成
     *
     * @param int $status
     *
     * @return array
     */
    private function makeResponseFromGptEngine(int $status = 200): array
    {
        return [
            'status' => $status,
            'answer' => 'テスト回答',
            'source_documents' => 'テスト回答_source',
            'token_counts' => [
                'prompt_tokens' => 10,
                'completion_tokens' => 10,
            ],
            'cost' => 00000010,
            'pdf_pages' => [1, 2, 3],
        ];
    }

    /**
     * GptEngineConnectionをモック化
     *
     * @param array $responseFromGptEngine
     *
     * @return void
     */
    private function setGptEngineConnectionMock(array $responseFromGptEngine): void
    {
        $gptEngineConnectionMock = m::mock(GptEngineConnection::class);
        $gptEngineConnectionMock->shouldReceive('post')
            ->andReturn($responseFromGptEngine);

        // 具象クラスの中身をmockにする
        $this->app->instance(GptEngineConnectionInterface::class, $gptEngineConnectionMock);
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
        return $this->actingAs($this->user, static::$guard)
            ->post(route('api.user.chat.store'), $requestParams);
    }
}
