<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShoppingCart extends Model
{
    use HasFactory;

    protected $table = 'carrito_compras';

    protected $fillable = [
        'id_customer',
        'id_product',
        'amount'
    ];

    protected $casts = [
        'amount' => 'integer'
    ];

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'id_customer');
    }

    // Relación con Producto
    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product');
    }
}
