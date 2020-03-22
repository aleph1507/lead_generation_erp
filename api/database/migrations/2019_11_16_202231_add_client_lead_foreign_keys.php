<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClientLeadForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('client_lead', function (Blueprint $table) {
//             $table->foreign('client_id')->references('id')
//                 ->on('client')->onDelete('set null');
            $table->foreign('client_id')->references('id')
                ->on('clients')->onDelete('set null');
            $table->foreign('lead_id')->references('id')
                ->on('leads')->onDelete('set null');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('client_lead', function (Blueprint $table) {
//            $table->dropForeign('client_lead_id');
//            $table->dropForeign('lead_client_id');
        });
    }
}
