<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStorePlansTable extends Migration {
    public function up() {
        Schema::create('store_plans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('store_id')->nullable();
            $table->integer('plan_id')->nullable();
            $table->string('rac_id')->nullable();
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Inactive');
            $table->longText('confirmation_url')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('store_plans');
    }
}
