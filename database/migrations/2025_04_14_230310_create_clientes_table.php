<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('last_name', 200);
            $table->string('email', 200);
            $table->string('password', 200);
            $table->string('address', 200);
            $table->string('phone_number', 200);
            $table->string('type', 200)->default('cliente');
            $table->string('verify')->default('no verificado');
            $table->string('token_verification', 255)->nullable();
            $table->string('status')->default('habilitado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
