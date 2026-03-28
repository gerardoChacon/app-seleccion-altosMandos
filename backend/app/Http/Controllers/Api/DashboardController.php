<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\MatchVacante;
use App\Models\Vacante;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $vacantesActivas = Vacante::where('estatus', 'disponible')->count();

        $candidatosEnEvaluacion = MatchVacante::where('estado_proceso', 'en_evaluacion')->count();

        $vacantesPorArea = Vacante::select('area.nombre_area', DB::raw('count(*) as cantidad'))
            ->join('area', 'vacante.id_area', '=', 'area.id_area')
            ->where('vacante.estatus', 'disponible')
            ->groupBy('area.nombre_area')
            ->orderBy('cantidad', 'desc')
            ->get();

        $empleadosActivos = Empleado::where('estatus', 'activo')->count();

        $compatiblesEsteMes = MatchVacante::where('resultado', 'compatible')
            ->whereMonth('fecha_match', now()->month)
            ->whereYear('fecha_match', now()->year)
            ->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'vacantes_activas'          => $vacantesActivas,
                'candidatos_en_evaluacion'  => $candidatosEnEvaluacion,
                'vacantes_por_area'         => $vacantesPorArea,
                'empleados_activos'         => $empleadosActivos,
                'compatibles_este_mes'      => $compatiblesEsteMes,
            ],
        ]);
    }
}
