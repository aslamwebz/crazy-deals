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
        Schema::table('users', function (Blueprint $table) {
            // Personal Information
            $table->string('phone')->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('date_of_birth');
            
            // Account Information
            $table->string('avatar')->nullable()->after('gender');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('avatar');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            
            // Billing Information (for quick access)
            $table->foreignId('default_billing_address_id')->nullable()->after('last_login_ip')
                ->constrained('addresses')->onDelete('set null');
            $table->foreignId('default_shipping_address_id')->nullable()->after('default_billing_address_id')
                ->constrained('addresses')->onDelete('set null');
            
            // Indexes for better performance
            $table->index(['email', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['default_billing_address_id']);
            $table->dropForeign(['default_shipping_address_id']);
            
            // Drop columns
            $table->dropColumn([
                'phone',
                'date_of_birth',
                'gender',
                'avatar',
                'status',
                'last_login_at',
                'last_login_ip',
                'default_billing_address_id',
                'default_shipping_address_id'
            ]);
            
            // Drop indexes
            $table->dropIndex(['email', 'status']);
        });
    }
};
