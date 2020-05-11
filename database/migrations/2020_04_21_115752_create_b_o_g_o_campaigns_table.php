<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBOGOCampaignsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('bogo_campaigns', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('campaign_id');
            $table->string('name')->nullable();
            $table->string('buy_type')->nullable();
            $table->string('buy_ids')->nullable();
            $table->string('buy_quantity')->nullable();
            $table->string('customer_ids_eligible')->nullable();
            $table->string('get_type')->nullable();
            $table->string('get_ids')->nullable();
            $table->string('get_quantity')->nullable();
            $table->string('discount_type')->nullable();
            $table->string('discount_value')->nullable();
            $table->string('max_use_per_order')->nullable();
            $table->string('min_use_per_order')->nullable();
            $table->string('limit_to_one_use_per_customer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('bogo_campaigns');
    }
}
