<?php

declare(strict_types=1);

namespace Tests\Feature\Frontend\Auth;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    private User $user;

    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

     /**
     * 正常系 - emailとpasswordが正しければ、認証され、トップ画面にリダイレクトすること
     */
    public function test_user_can_authenticate(): void
    {
        $response = $this->post(route('user.auth.login'), [
            'email' => $this->user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated('web');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'intendedUrl'
        ]);

        $response->assertJson([
            'intendedUrl' => RouteServiceProvider::HOME
        ]);
    }
}