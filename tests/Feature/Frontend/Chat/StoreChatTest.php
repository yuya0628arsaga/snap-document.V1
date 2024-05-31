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
     * 正常系
     */
    public function test_store_chat_success(): void
    {
        $requestParams = [
            'question' => '質問テスト',
            'manualName' => $this->document->name,
            'chatHistory' => [],
            'chatGroupId' => $this->chatGroup->id,
            'isGetPdfPage' => false,
            'gptModel' => 'gpt-3.5-turbo',
        ];

        $responseFromGptEngine = [
            'status' => 200,
            'answer' => 'テスト回答',
            'source_documents' => 'テスト回答_source',
            'token_counts' => [
                'prompt_tokens' => 10,
                'completion_tokens' => 10,
            ],
            'cost' => 00000010,
            'pdf_pages' => [1, 2, 3],
        ];

        $gptEngineConnectionMock = m::mock(GptEngineConnection::class);
        $gptEngineConnectionMock->shouldReceive('post')
            ->andReturn($responseFromGptEngine);

        // 具象クラスの中身をmockにする
        $this->app->instance(GptEngineConnectionInterface::class, $gptEngineConnectionMock);

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
