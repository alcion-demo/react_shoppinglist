<?php

namespace Database\Factories;

use App\Models\CurrentCart;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ShoppingItem;
use App\Enums\ShopType;

/**
 * @extends Factory<CurrentCart>
 */
class CurrentCartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shopping_item_id' => ShoppingItem::factory(),
            'price' => fake()->numberBetween(0, 9999),
            'quantity' => fake()->numberBetween(1, 5) . '個',
            'shop_type' => ShopType::Supermarket->value,
        ];
    }
}
