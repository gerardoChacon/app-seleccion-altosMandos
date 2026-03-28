<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aptitud extends Model
{
    protected $table = 'aptitud';
    protected $primaryKey = 'id_aptitud';
    public $timestamps = false;

    protected $fillable = ['nombre_aptitud', 'descripcion'];

    public function empleados()
    {
        return $this->belongsToMany(Empleado::class, 'empleado_aptitud', 'id_aptitud', 'id_empleado')
            ->withPivot('porcentaje_obtenido');
    }

    public function vacantes()
    {
        return $this->belongsToMany(Vacante::class, 'vacante_aptitud', 'id_aptitud', 'id_vacante')
            ->withPivot('porcentaje_minimo');
    }
}
