<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\ShopType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;

#[Fillable(['shopping_item_id', 'price',
'quantity' ,'shop_type', 'purchased_at'])]
class PurchaseLog extends Model
{
    use HasFactory;

    protected $casts = [
        'shop_type' => ShopType::class,
        'purchased_at' => 'datetime',
    ];

    /**
     * 商品情報取得
     *
     * @return void
     */
    public function item()
    {
        return $this->belongsTo(ShoppingItem::class, 'shopping_item_id');
    }

    /**
     * 日付加工
     *
     * @return string
     */
    public function getPurchasedDateStringAttribute(): string
    {
        return $this->purchased_at->format('Y-m-d');
    }

    /**
     * ユーザーデータ絞り込み
     *
     * @param Builder $query
     * @param integer $userId
     * @return Builder
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->whereHas('item', fn($q) => $q->where('user_id', $userId));
    }

    /**
     * 良く購入する商品取得
     *
     * @param integer $userId
     * @param integer $limit
     * @return void
     */
    public static function getFrequentItems(int $userId, int $limit = 5)
    {
        return self::forUser($userId)
            ->with('item')
            ->get()
            ->groupBy('shopping_item_id')
            ->sortByDesc(fn($logs) => $logs->count())
            ->take($limit)
            ->map(fn($logs) => $logs->first()); // 代表して最新の情報を返す
    }

    /**
     * 過去3日以内に購入された履歴があるか判定
     *
     * @param integer $userId
     * @param integer $shoppingItemId
     * @return void
     */
    public static function getRecentPurchaseIn3Days(int $userId, int $shoppingItemId): Collection
    {
        $log = self::forUser($userId)
            ->where('shopping_item_id', $shoppingItemId)
            ->where('purchased_at', '>=', now()->subDays(3))
            ->latest('purchased_at')
            ->first();

        return $log ? $log->purchased_at : null;
    }
}