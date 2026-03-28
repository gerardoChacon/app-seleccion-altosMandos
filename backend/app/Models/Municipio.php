<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    protected $table = 'municipio';
    protected $primaryKey = 'id_municipio';
    public $timestamps = false;

    protected $fillable = ['nombre_municipio', 'id_estado'];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function direcciones()
    {
        return $this->hasMany(Direccion::class, 'id_municipio', 'id_municipio');
    }
}
