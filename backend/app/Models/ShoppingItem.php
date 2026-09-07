<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\PurchaseLog;
use Illuminate\Database\Eloquent\Builder;

#[Fillable(['user_id', 'name', 'is_active'])]
class ShoppingItem extends Model
{
    public function recentPurchaseLogs()
    {
        return $this->hasMany(PurchaseLog::class)->latest('purchased_at');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // 2. 検索条件の共通化
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}