<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';
    protected $primaryKey = 'id_estado';
    public $timestamps = false;

    protected $fillable = ['nombre_estado'];

    public function municipios()
    {
        return $this->hasMany(Municipio::class, 'id_estado', 'id_estado');
    }
}
