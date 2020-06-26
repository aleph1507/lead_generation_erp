<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leads', function (Blueprint $table) {
//            "id","duxid","VisitTime","Profile","Picture","Degree","First Name","Middle Name","Last Name",
//              "Summary","Title","From","Company","CompanyProfile","CompanyWebsite","PersonalWebsite",
//              "Email","Phone","IM","Twitter","Location","Industry","My Tags","My Notes",
            $table->bigIncrements('id');
            $table->string('duxid')->nullable();
            $table->string('visitTime')->nullable();
            $table->string('profile')->nullable();
            $table->string('picture')->nullable();
            $table->string('degree')->nullable();
            $table->string('firstName')->nullable();
            $table->string('middleName')->nullable();
            $table->string('lastName')->nullable();
            $table->text('summary')->nullable();
            $table->string('title')->nullable();
            $table->string('from')->nullable();
            $table->string('company')->nullable();
            $table->string('companyProfile')->nullable();
            $table->string('companyWebsite')->nullable();
            $table->string('personalWebsite')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('IM')->nullable();
            $table->string('twitter')->nullable();
            $table->string('location')->nullable();
            $table->string('industry')->nullable();
            $table->string('myTags')->nullable();
            $table->string('myNotes')->nullable();
//            $table->unsignedBigInteger('client_id')->nullable();
//            $table->string('name');
            $table->enum('status', ['CONTACTED', 'ACCEPTED', 'REJECTED', 'LEAD'])
                ->default('CONTACTED');

//            $table->foreign('client_id')->references('id')->on('clients')
//                ->onDelete('set null');
            $table->softDeletes();
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
        Schema::dropIfExists('leads');
    }
}
