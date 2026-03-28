<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Puesto extends Model
{
    protected $table = 'puesto';
    protected $primaryKey = 'id_puesto';
    public $timestamps = false;

    protected $fillable = ['nombre_puesto', 'descripcion'];

    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'id_puesto', 'id_puesto');
    }

    public function vacantes()
    {
        return $this->hasMany(Vacante::class, 'id_puesto', 'id_puesto');
    }
}
