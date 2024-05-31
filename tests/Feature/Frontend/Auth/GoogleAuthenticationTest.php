<?php

use Tests\TestCase;
use Laravel\Socialite\Facades\Socialite;
use Mockery as m;
use Laravel\Socialite\Contracts\User as ProviderUser;

class GoogleAuthenticationTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Socialiteのモックを設定
     *
     * @param bool $authSuccess
     */
    protected function mockSocialiteFacade($authSuccess = true)
    {
        $abstractUser = m::mock(ProviderUser::class);
        $abstractUser->shouldReceive('getId')->andReturn('123456789');
        $abstractUser->shouldReceive('getNickname')->andReturn('test_nickname');
        $abstractUser->shouldReceive('getName')->andReturn('テスト');
        $abstractUser->shouldReceive('getEmail')->andReturn('test@test.com');
        $abstractUser->shouldReceive('getAvatar')->andReturn('https://test.com/avatar.jpg');

        $provider = m::mock(\Laravel\Socialite\Contracts\Provider::class);
        $authSuccess
        ? $provider->shouldReceive('user')->andReturn($abstractUser)
        : $provider->shouldReceive('user')->andThrow(new \Exception('Google authentication failed'));

        $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
    }

    /**
     * 正常系 - Googleログインボタンを押下したらGoogleの認証画面にリダイレクトする
     */
    public function test_google_redirect()
    {
        $response = $this->get(route('user.auth.login.google'));
        $response->assertRedirect();
    }

    /**
     * 正常系 - ユーザーがGoogleで認証した場合、ログインさせる
     */
    public function test_google_callback()
    {
        $this->mockSocialiteFacade();
        $response = $this->get(route('user.auth.login.google.callback'));

        // 適切なリダイレクト先やユーザーの認証を確認
        $response->assertRedirect(route('user.home'));
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'name' => 'テスト',
            'email' => 'test@test.com',
            'avatar_url' => 'https://test.com/avatar.jpg',
        ]);
    }

    /**
     * 異常系 - ユーザーがGoogle認証で失敗した場合、ログイン画面にリダイレクトさせる
     */
    public function test_google_callback_failure()
    {
        $this->mockSocialiteFacade(false);

        $response = $this->get(route('user.auth.login.google.callback'));
        $response->assertRedirect(route('user.auth.index'));
        $this->assertGuest();
    }
}
