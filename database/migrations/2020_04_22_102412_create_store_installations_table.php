<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoreInstallationsTable extends Migration {
    public function up(){
        Schema::create('store_installations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('store_id')->nullable();
            $table->string('uninstallation_date')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('store_installations');
    }
}