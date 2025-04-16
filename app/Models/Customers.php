<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customers extends Authenticatable
{
    use Notifiable;
    use HasFactory, HasApiTokens;

    protected $table = "clientes";

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'address',
        'phone_number',
        'verify',
        'type',
        'token_verification',
        'status'
    ];

    public function ShoppingCart()
    {
        return $this->hasMany(ShoppingCart::class, 'id_customer');
    }

    // Relación con Detalles de ventas
    public function saleDetails()
    {
        return $this->hasMany(SalesDetail::class, 'id_customer');
    }

    public function isVerificationTokenValid()
    {
        return $this->created_at->gt(now()->subHours(24));
    }
}
