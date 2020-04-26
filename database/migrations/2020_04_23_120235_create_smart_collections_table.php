<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateSmartCollectionsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('smart_collections', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('store_id')->nullable();
            $table->string('handle')->nullable();
            $table->string('title')->nullable();
            $table->string('created_at')->nullable();
            $table->string('updated_at')->nullable();
            $table->longText('body_html')->nullable();
            $table->string('published_at')->nullable();
            $table->string('disjunctive')->nullable();
            $table->string('sort_order')->nullable();
            $table->string('rules')->nullable();
            $table->string('template_suffix')->nullable();
            $table->string('published_scope')->nullable();
            $table->string('admin_graphql_api_id')->nullable();
            $table->longText('image')->nullable();
            $table->timestamp('created_at_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at_date')->default(DB::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('smart_collections');
    }
}
