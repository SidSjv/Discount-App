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
            $table->id();
            $table->string('campaign_id');
            $table->string('buy_type');
            $table->string('buy_ids');
            $table->string('buy_quantity');
            $table->string('customer_ids_eligible');
            $table->string('get_type');
            $table->string('get_ids');
            $table->string('get_quantity');
            $table->string('discount_type');
            $table->string('discount_value');
            $table->string('max_use_per_order');
            $table->string('min_use_per_order');
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
