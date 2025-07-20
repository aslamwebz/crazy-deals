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
        // First, add the address relationship columns
        Schema::table('orders', function (Blueprint $table) {
            // Add foreign keys for addresses
            $table->foreignId('shipping_address_id')
                ->after('user_id')
                ->nullable()
                ->constrained('addresses')
                ->onDelete('set null');
                
            $table->foreignId('billing_address_id')
                ->after('shipping_address_id')
                ->nullable()
                ->constrained('addresses')
                ->onDelete('set null');
            
            // Keep the existing address fields for backward compatibility
            // but make them nullable since we'll be using the relationships
            $table->string('shipping_name')->nullable()->change();
            $table->string('shipping_email')->nullable()->change();
            $table->string('shipping_phone')->nullable()->change();
            $table->text('shipping_address')->nullable()->change();
            $table->string('shipping_city')->nullable()->change();
            $table->string('shipping_state')->nullable()->change();
            $table->string('shipping_country')->nullable()->change();
            $table->string('shipping_zipcode')->nullable()->change();
            
            $table->boolean('same_as_shipping')->nullable()->change();
            
            $table->string('billing_name')->nullable()->change();
            $table->string('billing_email')->nullable()->change();
            $table->string('billing_phone')->nullable()->change();
            $table->text('billing_address')->nullable()->change();
            $table->string('billing_city')->nullable()->change();
            $table->string('billing_state')->nullable()->change();
            $table->string('billing_country')->nullable()->change();
            $table->string('billing_zipcode')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop the foreign key constraints first
            $table->dropForeign(['shipping_address_id']);
            $table->dropForeign(['billing_address_id']);
            
            // Drop the columns
            $table->dropColumn([
                'shipping_address_id',
                'billing_address_id'
            ]);
            
            // Revert the nullable changes (you'll need to handle data consistency manually)
            $table->string('shipping_name')->nullable(false)->change();
            $table->string('shipping_email')->nullable(false)->change();
            $table->string('shipping_phone')->nullable(false)->change();
            $table->text('shipping_address')->nullable(false)->change();
            $table->string('shipping_city')->nullable(false)->change();
            $table->string('shipping_state')->nullable(false)->change();
            $table->string('shipping_country')->nullable(false)->change();
            $table->string('shipping_zipcode')->nullable(false)->change();
            
            $table->boolean('same_as_shipping')->default(true)->change();
            
            $table->string('billing_name')->nullable()->change();
            $table->string('billing_email')->nullable()->change();
            $table->string('billing_phone')->nullable()->change();
            $table->text('billing_address')->nullable()->change();
            $table->string('billing_city')->nullable()->change();
            $table->string('billing_state')->nullable()->change();
            $table->string('billing_country')->nullable()->change();
            $table->string('billing_zipcode')->nullable()->change();
        });
    }
};
