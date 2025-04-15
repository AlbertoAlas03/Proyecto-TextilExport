<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Products extends Model
{
    use HasFactory;

    protected $table = "productos";

    protected $fillable = [
        'id_category',
        'code',
        'name',
        'description',
        'image',
        'price',
        'stock'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer'
    ];

    public function categories() //relacion con tabla categorias
    {
        return $this->belongsTo(Categories::class, 'id_category');
    }

    public function ShoppingCart()
    {
        return $this->hasMany(ShoppingCart::class, 'id_product');
    }

    public function SaleDetail()
    {
        return $this->hasMany(SalesDetail::class, 'id_product');
    }
}
