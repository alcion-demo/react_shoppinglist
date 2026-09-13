<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Session\Middleware\StartSession;


class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app['router']->prependMiddlewareToGroup(
            'api',
            StartSession::class
        );
    }

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_guest_cannot_get_user_information(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_own_information(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    public function test_normal_user_cannot_access_admin_api(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/admin/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_api(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/users');

        $response
            ->assertOk()
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'email',
                ],
            ]);
    }

    public function test_logout_invalidates_session(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson([
                'message' => 'Logged out',
            ]);

        // actingAs() が保持しているテスト用の認証状態を破棄
        $this->app['auth']->forgetGuards();

        $this->getJson('/api/user')
            ->assertStatus(401);
    }

    public function test_guest_cannot_access_admin_api(): void
    {
        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(401);
    }
}
