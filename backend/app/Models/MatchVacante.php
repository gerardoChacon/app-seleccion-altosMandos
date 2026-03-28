<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchVacante extends Model
{
    protected $table = 'match_vacante';
    protected $primaryKey = 'id_match';
    public $timestamps = false;

    protected $fillable = [
        'id_empleado', 'id_vacante',
        'porcentaje_compatibilidad', 'resultado', 'estado_proceso', 'fecha_match',
    ];

    protected $casts = [
        'fecha_match'               => 'date',
        'porcentaje_compatibilidad' => 'float',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado', 'id_empleado');
    }

    public function vacante()
    {
        return $this->belongsTo(Vacante::class, 'id_vacante', 'id_vacante');
    }
}
