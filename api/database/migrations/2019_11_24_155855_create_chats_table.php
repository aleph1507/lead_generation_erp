<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('client_id')->unsigned()->nullable();
            $table->unsignedBigInteger('lead_id')->unsigned()->nullable();

            $table->unsignedBigInteger('message_id')->unsigned()->nullable();
            $table->unsignedBigInteger('response_id')->unsigned()->nullable();

            $table->foreign('lead_id')->references('id')
                ->on('leads')->onDelete('cascade');

            $table->foreign('client_id')->references('id')
                ->on('clients')->onDelete('cascade');

            $table->foreign('message_id')->references('id')
                ->on('messages')->onDelete('cascade');

            $table->foreign('response_id')->references('id')
                ->on('responses')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('chats');
    }
}
