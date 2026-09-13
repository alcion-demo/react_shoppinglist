<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Enums\ShopType;
use App\Models\CurrentCart;
use App\Models\ShoppingItem;
use App\Models\User;
use App\Models\PurchaseLog;
use Illuminate\Session\Middleware\StartSession;
use App\Services\ShoppingService;

class ShoppingTest extends TestCase
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
     * 自分のカート一覧を取得できる
     */
    public function test_user_can_get_own_shopping_list(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 300,
            'quantity' => '2個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/shopping-items');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'items',
                'frequentItems',
                'history',
                'shopTypes',
            ]);

        $response->assertJsonFragment([
            'name' => 'りんご',
            'price' => 300,
            'quantity' => '2個',
        ]);
    }

    /**
     * 他ユーザーのカートは取得されない
     */
    public function test_user_cannot_see_other_users_shopping_items(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $itemA = ShoppingItem::factory()->create([
            'user_id' => $userA->id,
            'name' => 'りんご',
        ]);

        $itemB = ShoppingItem::factory()->create([
            'user_id' => $userB->id,
            'name' => 'バナナ',
        ]);

        CurrentCart::factory()->create([
            'shopping_item_id' => $itemA->id,
        ]);

        CurrentCart::factory()->create([
            'shopping_item_id' => $itemB->id,
        ]);

        $response = $this->actingAs($userA)
            ->getJson('/api/shopping-items');

        $response
            ->assertOk()
            ->assertJsonFragment([
                'name' => 'りんご',
            ])
            ->assertJsonMissing([
                'name' => 'バナナ',
            ]);
    }

    /**
     * 商品を追加すると商品とカートが作成される
     */
    public function test_user_can_add_shopping_item(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => '牛乳',
                'shop_type' => ShopType::Supermarket->value,
                'price' => 250,
                'quantity' => '1本',
            ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => 'リストに追加しました',
            ]);

        $item = ShoppingItem::where('user_id', $user->id)
            ->where('name', '牛乳')
            ->first();

        $this->assertNotNull($item);

        $this->assertDatabaseHas('current_carts', [
            'shopping_item_id' => $item->id,
            'price' => 250,
            'quantity' => '1本',
            'shop_type' => ShopType::Supermarket->value,
        ]);
    }

    public function test_user_can_update_shopping_item(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 100,
            'quantity' => '1個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $response = $this->actingAs($user)->putJson(
            "/api/shopping-items/{$cart->id}",
            [
                'name' => 'バナナ',
                'price' => 200,
                'quantity' => '2本',
                'shop_type' => ShopType::Drugstore->value,
            ]
        );

        $response
            ->assertOk()
            ->assertJson([
                'message' => '変更を保存しました',
            ]);

        $this->assertDatabaseHas('shopping_items', [
            'id' => $item->id,
            'name' => 'バナナ',
        ]);

        $this->assertDatabaseHas('current_carts', [
            'id' => $cart->id,
            'price' => 200,
            'quantity' => '2本',
            'shop_type' => ShopType::Drugstore->value,
        ]);
    }

    public function test_user_can_delete_shopping_item(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/shopping-items/{$cart->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'リストから削除しました',
            ]);

        $this->assertDatabaseMissing('current_carts', [
            'id' => $cart->id,
        ]);
    }

    //他ユーザーの商品を更新できない
    public function test_user_cannot_update_other_users_shopping_item(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $userB->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 100,
            'quantity' => '1個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $response = $this->actingAs($userA)
            ->putJson("/api/shopping-items/{$cart->id}", [
                'name' => 'バナナ',
                'price' => 999,
                'quantity' => '9個',
                'shop_type' => ShopType::Drugstore->value,
            ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('shopping_items', [
            'id' => $item->id,
            'name' => 'りんご',
        ]);
    }

    //他ユーザーの商品を削除できない
    public function test_user_cannot_delete_other_users_shopping_item(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $userB->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
        ]);

        $response = $this->actingAs($userA)
            ->deleteJson("/api/shopping-items/{$cart->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('current_carts', [
            'id' => $cart->id,
        ]);
    }

    //購入完了
    public function test_user_can_complete_purchase(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 150,
            'quantity' => '2個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/shopping-items/{$cart->id}/purchase");

        $response
            ->assertOk()
            ->assertJson([
                'message' => '購入を記録しました！',
            ])
            ->assertJsonStructure([
                'message',
                'purchaseLog' => [
                    'id',
                    'shopping_item_id',
                    'price',
                    'quantity',
                    'shop_type',
                    'purchased_at',
                ],
            ]);

        $this->assertDatabaseHas('purchase_logs', [
            'shopping_item_id' => $item->id,
            'price' => 150,
            'quantity' => '2個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $this->assertDatabaseMissing('current_carts', [
            'id' => $cart->id,
        ]);
    }

    //最近購入した商品の表示
    public function test_recently_purchased_item_has_recent_purchased_at(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => '牛乳',
        ]);

        PurchaseLog::factory()->create([
            'shopping_item_id' => $item->id,
            'purchased_at' => now()->subDays(2),
        ]);

        CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/shopping-items');

        $response
            ->assertOk()
            ->assertJsonPath('items.0.recentPurchasedAt', fn ($value) => $value !== null);
    }

    public function test_item_purchased_more_than_three_days_ago_has_no_recent_purchased_at(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => '牛乳',
        ]);

        PurchaseLog::factory()->create([
            'shopping_item_id' => $item->id,
            'purchased_at' => now()->subDays(4),
        ]);

        CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/shopping-items');

        $response
            ->assertOk()
            ->assertJsonPath('items.0.recentPurchasedAt', null);
    }

    public function test_product_name_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => '',
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(422);
    }

    public function test_negative_price_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => -1,
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(422);
    }

    public function test_price_over_limit_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => 1000000,
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(422);
    }

    public function test_quantity_starting_with_number_is_accepted(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => 300,
                'quantity' => '3個',
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(200);
    }

    public function test_quantity_not_starting_with_number_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => 300,
                'quantity' => '個3',
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(422);
    }

    public function test_invalid_shop_type_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => 300,
                'shop_type' => 999,
            ])
            ->assertStatus(422);
    }

    public function test_price_must_be_integer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/shopping-items', [
                'name' => 'りんご',
                'price' => '300円',
                'shop_type' => ShopType::Supermarket->value,
            ])
            ->assertStatus(422);
    }

    public function test_user_can_update_own_shopping_item(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 300,
            'quantity' => '2個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $this->actingAs($user)
            ->putJson("/api/shopping-items/{$cart->id}", [
                'name' => 'バナナ',
                'price' => 500,
                'quantity' => '3本',
                'shop_type' => ShopType::Drugstore->value,
            ])
            ->assertOk()
            ->assertJson([
                'message' => '変更を保存しました',
            ]);

        $this->assertDatabaseHas('shopping_items', [
            'id' => $item->id,
            'name' => 'バナナ',
        ]);

        $this->assertDatabaseHas('current_carts', [
            'id' => $cart->id,
            'price' => 500,
            'quantity' => '3本',
            'shop_type' => ShopType::Drugstore->value,
        ]);
    }

    public function test_user_can_delete_own_shopping_item(): void
    {
        $user = User::factory()->create();

        $item = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $cart = CurrentCart::factory()->create([
            'shopping_item_id' => $item->id,
            'price' => 300,
            'quantity' => '2個',
            'shop_type' => ShopType::Supermarket->value,
        ]);

        $this->actingAs($user)
            ->deleteJson("/api/shopping-items/{$cart->id}")
            ->assertOk()
            ->assertJson([
                'message' => 'リストから削除しました',
            ]);

        $this->assertDatabaseMissing('current_carts', [
            'id' => $cart->id,
        ]);
    }

    public function test_frequently_purchased_items_are_ranked_by_purchase_count(): void
    {
        $user = User::factory()->create();

        $itemA = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'りんご',
        ]);

        $itemB = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'バナナ',
        ]);

        $itemC = ShoppingItem::factory()->create([
            'user_id' => $user->id,
            'name' => 'みかん',
        ]);

        // Aを3回購入
        PurchaseLog::factory()->count(3)->create([
            'shopping_item_id' => $itemA->id,
        ]);

        // Bを2回購入
        PurchaseLog::factory()->count(2)->create([
            'shopping_item_id' => $itemB->id,
        ]);

        // Cを1回購入
        PurchaseLog::factory()->create([
            'shopping_item_id' => $itemC->id,
        ]);

        $frequentItems = PurchaseLog::getFrequentItems($user->id);

        $this->assertCount(3, $frequentItems);

        $this->assertSame(
            $itemA->id,
            $frequentItems->values()->get(0)->shopping_item_id
        );

        $this->assertSame(
            $itemB->id,
            $frequentItems->values()->get(1)->shopping_item_id
        );

        $this->assertSame(
            $itemC->id,
            $frequentItems->values()->get(2)->shopping_item_id
        );
    }

    public function test_momo_is_valid_ingredient(): void
    {
        $service = app(ShoppingService::class);

        $this->assertFalse($service->isInvalid('もも'));
    }

    public function test_single_hiragana_is_invalid(): void
    {
        $service = app(ShoppingService::class);

        $this->assertTrue($service->isInvalid('あ'));
    }

    public function test_repeated_hiragana_is_invalid(): void
    {
        $service = app(ShoppingService::class);

        $this->assertTrue($service->isInvalid('いい'));
    }

    public function test_symbols_are_invalid(): void
    {
        $service = app(ShoppingService::class);

        $this->assertTrue($service->isInvalid('りんご!'));
        $this->assertTrue($service->isInvalid('りんご-'));
    }

    public function test_purchase_history_is_separated_by_user(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $itemA = ShoppingItem::factory()->create([
            'user_id' => $userA->id,
            'name' => 'りんご',
        ]);

        $itemB = ShoppingItem::factory()->create([
            'user_id' => $userB->id,
            'name' => 'バナナ',
        ]);

        PurchaseLog::factory()->create([
            'shopping_item_id' => $itemA->id,
            'price' => 300,
            'quantity' => '1個',
            'shop_type' => ShopType::Supermarket->value,
            'purchased_at' => now(),
        ]);

        PurchaseLog::factory()->create([
            'shopping_item_id' => $itemB->id,
            'price' => 200,
            'quantity' => '2本',
            'shop_type' => ShopType::Drugstore->value,
            'purchased_at' => now(),
        ]);

        $response = $this->actingAs($userA)
            ->getJson('/api/shopping-items')
            ->assertOk();

        $history = $response->json('history');

        $historyJson = json_encode($history, JSON_UNESCAPED_UNICODE);

        $this->assertStringContainsString('りんご', $historyJson);
        $this->assertStringNotContainsString('バナナ', $historyJson);
    }

    public function test_shopping_items_index_returns_expected_structure(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/shopping-items')
            ->assertOk()
            ->assertJsonStructure([
                'items',
                'frequentItems',
                'history',
                'shopTypes',
            ]);
    }

}
