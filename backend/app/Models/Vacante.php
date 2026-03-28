<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacante extends Model
{
    protected $table = 'vacante';
    protected $primaryKey = 'id_vacante';
    public $timestamps = true;

    protected $fillable = ['id_puesto', 'id_area', 'descripcion', 'fecha_apertura', 'estatus'];

    protected $casts = [
        'fecha_apertura' => 'date',
    ];

    public function puesto()
    {
        return $this->belongsTo(Puesto::class, 'id_puesto', 'id_puesto');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area', 'id_area');
    }

    public function aptitudes()
    {
        return $this->belongsToMany(Aptitud::class, 'vacante_aptitud', 'id_vacante', 'id_aptitud')
            ->withPivot('porcentaje_minimo');
    }

    public function matches()
    {
        return $this->hasMany(MatchVacante::class, 'id_vacante', 'id_vacante');
    }
}
