<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Users extends Authenticatable
{

    use Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'name',
        'last_name',
        'password',
        'email',
        'type',
        'active'
    ];

    protected $casts = [ //convert to boolean
        'active' => 'boolean'
    ];
}
