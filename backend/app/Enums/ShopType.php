<?php
declare(strict_types=1);

namespace App\Enums;

enum ShopType: int
{
    case Supermarket = 1;
    case Drugstore = 2;
    case Dollarsgore = 3;

    public function label(): string {
        return match($this) {
            self::Supermarket => 'スーパー',
            self::Drugstore => 'ドラッグストア',
            self::Dollarsgore => '百均',
        };
    }

    public function colorClass(): string {
        return match($this) {
            self::Supermarket => 'bg-green-500',
            self::Drugstore => 'bg-blue-500',
            self::Dollarsgore => 'bg-orange-500',
        };
    }

    public function isSupermarket(): bool {
        return $this === self::Supermarket;
    }

    public function icon(): string {
        return match($this) {
            self::Supermarket => 'shopping-cart',
            self::Drugstore => 'beaker',
            self::Dollarsgore => 'currency-yen',
        };
    }

}