<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesDetail extends Model
{
    use HasFactory;

    protected $table = 'detalle_ventas';

    protected $fillable = [
        'id_sale',
        'id_product',
        'amount',
        'unit price',
        'total'
    ];

    protected $casts = [
        'amount' => 'integer',
        'unit price' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    public function sale()
    {
        return $this->belongsTo(Sales::class, 'id_sale');
    }

    // Relación con Producto
    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product');
    }
}
