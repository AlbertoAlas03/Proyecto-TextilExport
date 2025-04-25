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
        Schema::create('detalle_ventas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_customer')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('id_product')->constrained('productos')->onDelete('cascade');
            $table->integer('amount')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total', 12, 2);
            $table->string('status', 100)->default('completada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_ventas');
    }
};
