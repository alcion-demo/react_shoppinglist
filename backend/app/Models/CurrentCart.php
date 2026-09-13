<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\ShopType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['shopping_item_id', 'price', 'quantity', 'shop_type'])]
class CurrentCart extends Model
{
    use HasFactory;

    protected $casts = [
        'shop_type' => ShopType::class,
    ];

    /**
     * 商品マスターとのリレーション
     */
    public function item()
    {
        return $this->belongsTo(ShoppingItem::class, 'shopping_item_id');
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
}