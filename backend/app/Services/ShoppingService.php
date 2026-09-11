<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\ShoppingItem;
use App\Models\PurchaseLog;
use Illuminate\Support\Facades\Http;
use App\Enums\ShopType;
use App\Models\CurrentCart;
use Carbon\Carbon;

class ShoppingService

{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function savePurchase(int $userId, array $data): CurrentCart
    {

        // 1. 商品を検索、なければ新規作成する（firstOrCreate を使う）
        $item = ShoppingItem::firstOrCreate(
            ['user_id' => $userId, 'name' => $data['name']],
            // 新規作成時のみ設定したい値があればここへ
        );

        // 2. カートに存在するか確認（そのユーザーのカート内限定にするために userId も考慮）
        $cartItem = CurrentCart::where('shopping_item_id', $item?->id)
                                ->whereHas('item', fn($q) => $q->where('user_id', $userId))
                                ->first();

        // すでにカートにある場合、クイック追加（データなし）なら何もしない
        if ($cartItem) {
            // 価格や個数が送られてきた時（手動入力）だけ更新する
            if (isset($data['price']) || isset($data['quantity'])) {
                $cartItem->update([
                    'quantity'  => $data['quantity'] ?? $cartItem->quantity,
                    'price'     => isset($data['price']) ? (int)$data['price'] : $cartItem->price,
                    'shop_type' => $data['shop_type'] ?? $cartItem->shop_type->value,
                ]);
            }
            return $cartItem;
        }

        // 3. カートにない場合、新規作成
        // このとき、もし過去の履歴から「一番最近の単価や個数」を引っ張りたいならここで検索する
        $lastLog = PurchaseLog::whereHas('item', fn($q) => $q->where('name', $data['name']))
                            ->latest()->first();

        return CurrentCart::create([
            'shopping_item_id' => $item->id,
            'quantity'         => $data['quantity'] ?? $lastLog?->quantity ?? 1,
            'price'            => (int)($data['price'] ?? $lastLog?->price ?? 0),
            'shop_type'        => $data['shop_type'] ?? $lastLog?->shop_type->value ?? ShopType::Supermarket->value,
        ]);
    }

    /**
     * 購入完了ボタンを押した時に、カートから履歴へ書き写す処理
     *
     * @param integer $itemId
     * @param array $data
     * @return void
     */
    public function recordPurchase(int $cartId, array $data)
    {
        $cart = CurrentCart::findOrFail($cartId);

        // 1. 購入履歴（PurchaseLog）の作成
        $log = PurchaseLog::create([
            'shopping_item_id' => $cart->shopping_item_id,
            'price'            => isset($data['price']) ? (int)$data['price'] : $cart->price,
            'quantity'         => $data['quantity'] ?? $cart->quantity, // 文字列のまま履歴へ引き継ぎ
            'shop_type'        => $data['shop_type'] ?? $cart->shop_type->value,
            'purchased_at'     => now(),
        ]);

        // 2. 購入が完了したので、今回のカートからは削除する
        $cart->delete();

        return $log;
    }

    /**
     * 削除
     *
     * @param integer $userId
     * @param integer $cartId
     * @return void
     */
    public function deleteCart(int $userId, int $cartId): void
    {
        $cart = CurrentCart::with('item')
            ->whereHas('item', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->findOrFail($cartId);

        $cart->delete();
    }

    /**
     * 禁止ワード
     *
     * @param string $item
     * @return boolean
     */
    public function isInvalid(string $item): bool
    {
        $allowWords = [
            'もも',
        ];

        if (in_array($item, $allowWords, true)) {
            return false;
        }

        // ひらがな1文字
        if (preg_match('/^[ぁ-ん]$/u', $item)) {
            return true;
        }

        // 同じひらがな2文字
        if (preg_match('/^([ぁ-ん])\1$/u', $item)) {
            return true;
        }

        // 記号が含まれていたら不正
        if (preg_match('/[\p{P}\p{S}]/u', $item)) {
            return true;
        }

        return false;
    }


    /**
     * 3日以内の購入判定
     *
     * @param integer $userId
     * @param integer $shoppingItemId
     * @return \Carbon\Carbon|null
     */
    public function getRecentPurchasedAt(int $userId, int $shoppingItemId): ?\Carbon\Carbon
    {
        return PurchaseLog::forUser($userId)
            ->where('shopping_item_id', $shoppingItemId)
            ->where('purchased_at', '>=', now()->subDays(3))
            ->latest('purchased_at')
            ->first()?->purchased_at;
    }

    public function updateCart(int $userId, int $cartId, array $data): CurrentCart
    {
        $cart = CurrentCart::with('item')
            ->whereHas('item', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->findOrFail($cartId);

        $cart->item->update([
            'name' => $data['name'],
        ]);

        $cart->update([
            'shop_type' => $data['shop_type'],
            'price'     => $data['price'],
            'quantity'  => $data['quantity'],
        ]);

        return $cart;
    }

}