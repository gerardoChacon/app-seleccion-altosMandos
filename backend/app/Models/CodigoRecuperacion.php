<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CodigoRecuperacion extends Model
{
    protected $table = 'codigos_recuperacion';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['correo', 'codigo', 'expiracion', 'usado'];

    protected $casts = [
        'expiracion'  => 'datetime',
        'usado'       => 'boolean',
        'created_at'  => 'datetime',
    ];
}
