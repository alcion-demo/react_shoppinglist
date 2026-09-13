<?php

namespace Database\Factories;

use App\Models\ShoppingItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends Factory<ShoppingItem>
 */
class ShoppingItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->word(),
            'is_active' => true,
        ];
    }
}
