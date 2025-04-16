<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesDetail extends Model
{
    use HasFactory;

    protected $table = 'detalle_ventas';

    protected $fillable = [
        'id_customer',
        'id_product',
        'amount',
        'unit price',
        'total',
        'status'
    ];

    protected $casts = [
        'amount' => 'integer',
        'unit price' => 'decimal:2',
        'total' => 'decimal:2'
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
