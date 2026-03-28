<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'area';
    protected $primaryKey = 'id_area';
    public $timestamps = false;

    protected $fillable = ['nombre_area'];

    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'id_area', 'id_area');
    }

    public function vacantes()
    {
        return $this->hasMany(Vacante::class, 'id_area', 'id_area');
    }
}
