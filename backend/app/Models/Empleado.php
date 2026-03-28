<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleado';
    protected $primaryKey = 'id_empleado';
    public $timestamps = true;

    protected $fillable = [
        'nombre', 'apellido_paterno', 'apellido_materno',
        'curp', 'nss', 'fecha_ingreso', 'fecha_nacimiento', 'rfc',
        'correo', 'fotografia', 'cv',
        'id_puesto', 'id_area', 'id_direccion', 'estatus',
    ];

    protected $casts = [
        'fecha_ingreso'    => 'date',
        'fecha_nacimiento' => 'date',
    ];

    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");
    }

    public function puesto()
    {
        return $this->belongsTo(Puesto::class, 'id_puesto', 'id_puesto');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area', 'id_area');
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class, 'id_direccion', 'id_direccion');
    }

    public function usuario()
    {
        return $this->hasOne(User::class, 'id_empleado', 'id_empleado');
    }

    public function aptitudes()
    {
        return $this->belongsToMany(Aptitud::class, 'empleado_aptitud', 'id_empleado', 'id_aptitud')
            ->withPivot('porcentaje_obtenido');
    }

    public function matches()
    {
        return $this->hasMany(MatchVacante::class, 'id_empleado', 'id_empleado');
    }
}
