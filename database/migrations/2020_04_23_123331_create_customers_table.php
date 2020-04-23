<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('customers', function (Blueprint $table) {
            $table->id()->index();
            $table->string('store_id')->nullable();
            $table->string('email')->nullable();
            $table->string('accepts_marketing')->nullable();
            $table->string('created_at')->nullable();
            $table->string('updated_at')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('orders_count')->nullable();
            $table->string('state')->nullable();
            $table->string('total_spent')->nullable();
            $table->string('last_order_id')->nullable();
            $table->string('note')->nullable();
            $table->string('verified_email')->nullable();
            $table->string('multipass_identifier')->nullable();
            $table->string('tax_exempt')->nullable();
            $table->string('phone')->nullable();
            $table->string('tags')->nullable();
            $table->string('last_order_name')->nullable();
            $table->string('currency')->nullable();
            $table->longText('addresses')->nullable();
            $table->string('accepts_marketing_updated_at')->nullable();
            $table->string('marketing_opt_in_level')->nullable();
            $table->longText('tax_exemptions')->nullable();
            $table->string('admin_graphql_api_id')->nullable();
            $table->longText('default_address')->nullable();
            $table->timestamp('created_at_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at_date')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     */
    public function down() {
        Schema::dropIfExists('customers');
    }
}
