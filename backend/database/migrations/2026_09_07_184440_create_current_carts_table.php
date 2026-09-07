<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ShopType;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('current_carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopping_item_id')->constrained()->onDelete('cascade');
            $table->integer('price')->default(0);
            $table->string('quantity')->nullable();
            $table->string('shop_type')->default(ShopType::Supermarket->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('current_carts');
    }
};
