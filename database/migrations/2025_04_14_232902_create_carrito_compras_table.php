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
        Schema::create('carrito_compras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_customer')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('id_product')->constrained('productos')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['id_customer', 'id_product']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrito_compras');
    }
};
