<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Add rating columns
            if (!Schema::hasColumn('products', 'rating')) {
                $table->decimal('rating', 2, 1)->default(0);
            }
            
            if (!Schema::hasColumn('products', 'reviews_count')) {
                $table->integer('reviews_count')->default(0);
            }
            
            if (!Schema::hasColumn('products', 'badge')) {
                $table->string('badge')->nullable();
            }
            
            if (!Schema::hasColumn('products', 'badge_color')) {
                $table->string('badge_color')->nullable();
            }
            
            if (!Schema::hasColumn('products', 'sold_quantity')) {
                $table->integer('sold_quantity')->default(0);
            }
            
            if (!Schema::hasColumn('products', 'total_quantity')) {
                $table->integer('total_quantity')->default(0);
            }
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'rating',
                'reviews_count',
                'badge',
                'badge_color',
                'sold_quantity',
                'total_quantity'
            ]);
        });
    }
};
