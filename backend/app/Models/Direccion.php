<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    protected $table = 'direccion';
    protected $primaryKey = 'id_direccion';
    public $timestamps = false;

    protected $fillable = ['calle', 'numero', 'colonia', 'codigo_postal', 'id_municipio'];

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio', 'id_municipio');
    }

    public function empleado()
    {
        return $this->hasOne(Empleado::class, 'id_direccion', 'id_direccion');
    }
}
