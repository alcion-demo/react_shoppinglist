<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Hash;

class UserManagementTest extends TestCase
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
    /**
     * 管理者はユーザーを作成できる
     */
    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_admin' => false,
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'message' => 'ユーザーを追加しました',
            ]);

        $this->assertDatabaseHas('users', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'is_admin' => false,
        ]);

        $user = User::where('email', 'test@example.com')->first();

        $this->assertNotNull($user);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /**
     * メールアドレスの重複は拒否される
     */
    public function test_duplicate_email_is_rejected(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        User::factory()->create([
            'email' => 'duplicate@example.com',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => '別ユーザー',
            'email' => 'duplicate@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_admin' => false,
        ]);

        $response->assertStatus(422);
    }

    /**
     * パスワード確認が一致しない場合は拒否される
     */
    public function test_password_confirmation_must_match(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'テストユーザー',
            'email' => 'test2@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different-password',
            'is_admin' => false,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 管理者はユーザー情報を更新できる
     */
    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $user = User::factory()->create([
            'name' => '変更前',
            'email' => 'before@example.com',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($admin)->putJson("/api/users/{$user->id}", [
            'name' => '変更後',
            'email' => 'after@example.com',
            'is_admin' => true,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'ユーザーを更新しました',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '変更後',
            'email' => 'after@example.com',
            'is_admin' => true,
        ]);
    }

    /**
     * 管理者はユーザーを削除できる
     */
    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $user = User::factory()->create();

        $response = $this->actingAs($admin)
            ->deleteJson("/api/users/{$user->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'ユーザーを削除しました',
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    /**
     * プロフィールを更新できる
     */
    public function test_user_can_update_profile(): void
    {
        $user = User::factory()->create([
            'name' => '変更前',
            'email' => 'before-profile@example.com',
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/profile', [
                'name' => '変更後',
                'email' => 'after-profile@example.com',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'プロフィールを更新しました。',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '変更後',
            'email' => 'after-profile@example.com',
        ]);
    }

    /**
     * 現在のパスワードが間違っている場合は変更できない
     */
    public function test_password_cannot_be_changed_with_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old-password',
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/profile/password', [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertStatus(422);

        $user->refresh();

        $this->assertTrue(Hash::check('old-password', $user->password));
    }

    /**
     * 正しい現在のパスワードなら変更できる
     */
    public function test_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old-password',
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/profile/password', [
                'current_password' => 'old-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'パスワードを更新しました。',
            ]);

        $user->refresh();

        $this->assertTrue(Hash::check('new-password', $user->password));
        $this->assertFalse(Hash::check('old-password', $user->password));
    }

    /**
     * アカウント削除時にユーザーが削除される
     */
    public function test_user_can_delete_own_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->deleteJson('/api/profile');

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'アカウントを削除しました。',
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

}
