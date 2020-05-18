<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBulkCampaignsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('bulk_campaigns', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('campaign_id')->nullable();
            $table->string('name')->nullable();
            $table->longText('discount_levels')->nullable();
            $table->string('buy_type')->nullable();
            $table->longText('buy_ids')->nullable();
            $table->string('eligible_customers')->nullable();
            $table->string('max_uses_per_order')->nullable();
            $table->string('min_use_per_order')->nullable();
            $table->string('max_no_of_uses')->nullable();
            $table->string('limit_to_one_use_per_customer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('bulk_campaigns');
    }
}
