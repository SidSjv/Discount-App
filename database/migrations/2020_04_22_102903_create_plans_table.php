<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration {
    public function up() {
        Schema::create('plans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('time_period')->nullable();
            $table->float('price')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->integer('no_of_orders')->nullable();
            $table->enum('plan_type', ['Limited', 'Unlimited'])->default('Limited');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('plans');
    }
}