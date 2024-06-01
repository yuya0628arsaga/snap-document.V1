<?php

declare(strict_types=1);

namespace Tests\Feature\Frontend\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    private User $user;

    /** @var string  */
    static private string $guard = 'web';

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * 正常系 - ログイン画面がレンダリングされること
     */
    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get(route('user.auth.index'));

        $response->assertOk();
    }

    /**
     * 正常系 - emailとpasswordが正しければ、認証され、リダイレクトURLが返却されること
     */
    public function test_user_can_authenticate(): void
    {
        // ユーザーが認証の直前にアクセスしたいURLをsessionに設定
        $intendedUrl = '/intended-url';
        $this->withSession(['url.intended' => $intendedUrl]);

        $response = $this->post(route('user.auth.login'), [
            'email' => $this->user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated(static::$guard);
        $response->assertStatus(SymfonyResponse::HTTP_OK);

        $response->assertJsonStructure([
            'intendedUrl'
        ]);

        $response->assertJson([
            'intendedUrl' => $intendedUrl
        ]);
    }

    /**
     * 異常系 - emailとpasswordが正しくなければ、認証されず、401が返ること
     */
    public function test_user_can_not_authenticate_with_invalid_password(): void
    {
        $response = $this->post(route('user.auth.login'), [
            'email' => $this->user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest(static::$guard); // webが未認証であることを確認
        $response->assertStatus(SymfonyResponse::HTTP_UNAUTHORIZED);

        $response->assertJsonStructure([
            'status',
            'message',
        ]);

        $response->assertJson([
            'status' => SymfonyResponse::HTTP_UNAUTHORIZED,
            'message' => __('auth.failed')
        ]);
    }

    /**
     * 異常系 - 認証されていないときにトップ画面にアクセスすると、ログイン画面にリダイレクトすること
     */
    public function test_redirect_to_login_screen_when_un_authenticated(): void
    {
        $response = $this->get(route('user.home'));

        $response->assertRedirect(route('user.auth.index'));
    }

    /**
     * 異常系 - 認証されていないときにapiにアクセスすると、401が返ること
     */
    public function test_can_not_use_api_when_un_authenticated(): void
    {
        $response = $this->get(route('api.user.chat_groups.fetch'));

        $response->assertStatus(SymfonyResponse::HTTP_UNAUTHORIZED);
    }

    /**
     * 異常系 - 認証されているときにログイン画面にアクセスすると、トップ画面にリダイレクトすること
     */
    public function test_redirect_to_home_when_authenticated(): void
    {
        $response = $this->actingAs($this->user, static::$guard)
            ->get(route('user.auth.index'));

        $response->assertRedirect(route('user.home'));
    }

    /**
     * 正常系 - ログアウト
     */
    public function test_user_can_logout(): void
    {
        $response = $this->actingAs($this->user, static::$guard)
            ->get(route('user.auth.logout'));

        $this->assertGuest(static::$guard);
        $response->assertStatus(SymfonyResponse::HTTP_OK);

        $response->assertJsonStructure([
            'redirectUrl'
        ]);

        $response->assertJson([
            'redirectUrl' => route('user.auth.index')
        ]);
    }
}