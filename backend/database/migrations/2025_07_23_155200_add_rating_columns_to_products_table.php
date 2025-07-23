<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('rating', 2, 1)->default(0)->after('status');
            $table->integer('reviews_count')->default(0)->after('rating');
            $table->string('badge')->nullable()->after('reviews_count');
            $table->string('badge_color')->nullable()->after('badge');
            $table->integer('sold_quantity')->default(0)->after('quantity');
            $table->integer('total_quantity')->default(0)->after('sold_quantity');
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
