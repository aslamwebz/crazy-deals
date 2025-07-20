<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flash_deal_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flash_deal_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->integer('sold_quantity')->default(0);
            $table->timestamps();
            
            // Add unique constraint to prevent duplicate product entries in the same flash deal
            $table->unique(['flash_deal_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_deal_products');
    }
};
