<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sales extends Model
{

    use HasFactory;

    protected $table = "ventas";

    protected $fillable = [
        'id_cutomer',
        'total',
        'status',
        'pdf_voucher'
    ];

    protected $casts = [
        'total' => 'decimal:2'
    ];

    public function Customers()
    {
        return $this->belongsTo(Customers::class, 'id_customer');
    }

    public function details()
    {
        return $this->hasMany(SalesDetail::class, 'id_sale');
    }
}
