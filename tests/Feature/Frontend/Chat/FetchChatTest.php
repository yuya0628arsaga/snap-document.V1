<?php

namespace Tests\Feature\Frontend\Chat;

use App\Models\Chat;
use App\Models\ChatGroup;
use App\Models\ChatImage;
use App\Models\Document;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class FetchChatTest extends TestCase
{
    use RefreshDatabase;

    /** @var string */
    static private string $guard = 'web';

    /** @var User */
    private User $user;

    /** @var ChatGroup */
    private ChatGroup $chatGroup;

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $document = Document::factory()->create();

        $this->chatGroup = ChatGroup::factory()
            ->for($this->user)
            ->create();

        $chat = Chat::factory()
            ->for($this->user)
            ->for($this->chatGroup)
            ->for($document)
            ->create();

        Page::factory()
            ->for($chat)
            ->count(3)
            ->create()
            ->toArray();

        ChatImage::factory()
            ->for($chat)
            ->withDocument($document->name)
            ->count(3)
            ->create()
            ->toArray();
    }

    /**
     * 正常系
     */
    public function test_fetch_chat(): void
    {
        $requestParams = [
            'chat_group_id' => $this->chatGroup->id
        ];

        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'date',
                    'question',
                    'answer',
                    'documentName',
                    'pdfPages' => [],
                    'images' => [
                        '*' => [
                            'name',
                            'url',
                        ]
                    ],
                ]
            ]);
    }

    /**
     * 異常系 - chat_group_idがnullの場合
     */
    public function test_fetch_chat_when_chat_group_id_is_null(): void
    {
        $requestParams = [
            'chat_group_id' => null
        ];

        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY)
            ->assertJson([
                'status' => SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY,
                'message' => __('chat_groups.id').'は必ず指定してください。',
                'errors' => [
                    __('chat_groups.id').'は必ず指定してください。'
                ],
            ]);
    }

    /**
     * 異常系 - 存在しないchat_group_idを指定した場合
     */
    public function test_fetch_chat_when_chat_group_id_is_not_exist(): void
    {
        $requestParams = [
            'chat_group_id' => 'wrong-chat-group-id'
        ];

        $response = $this->commonExecution($requestParams);

        $response->assertStatus(SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY)
            ->assertJson([
                'status' => SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY,
                'message' => __('chat_groups.id').'が正しくありません。',
                'errors' => [
                    __('chat_groups.id').'が正しくありません。'
                ],
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
            ->get(route('api.user.chat.fetch', $requestParams));
    }
}
