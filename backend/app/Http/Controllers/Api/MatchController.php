<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\MatchVacante;
use App\Models\Vacante;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request)
    {
        $query = MatchVacante::with('empleado.puesto', 'empleado.area', 'vacante.puesto', 'vacante.area');

        if ($request->filled('id_vacante')) {
            $query->where('id_vacante', $request->id_vacante);
        }

        if ($request->filled('id_empleado')) {
            $query->where('id_empleado', $request->id_empleado);
        }

        if ($request->filled('estado_proceso')) {
            $query->where('estado_proceso', $request->estado_proceso);
        }

        if ($request->filled('resultado')) {
            $query->where('resultado', $request->resultado);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->orderBy('porcentaje_compatibilidad', 'desc')->paginate($request->get('per_page', 15)),
        ]);
    }

    /**
     * Calcula compatibilidad de todos los empleados activos contra una vacante.
     * Algoritmo: para cada aptitud requerida, contribución = min(obtenido/minimo*100, 100).
     * Compatibilidad final = promedio de contribuciones. Compatible si >= 70.
     */
    public function calcular($id_vacante)
    {
        $vacante = Vacante::with('aptitudes')->findOrFail($id_vacante);
        $aptitudesVacante = $vacante->aptitudes;

        if ($aptitudesVacante->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'La vacante no tiene aptitudes definidas.',
            ], 422);
        }

        $empleados = Empleado::where('estatus', 'activo')->with('aptitudes')->get();
        $resultados = [];

        foreach ($empleados as $empleado) {
            $totalScore    = 0;
            $totalAptitudes = $aptitudesVacante->count();

            foreach ($aptitudesVacante as $aptVacante) {
                $aptEmpleado = $empleado->aptitudes
                    ->firstWhere('id_aptitud', $aptVacante->id_aptitud);

                if ($aptEmpleado) {
                    $obtenido = $aptEmpleado->pivot->porcentaje_obtenido;
                    $minimo   = $aptVacante->pivot->porcentaje_minimo;
                    $totalScore += $minimo > 0
                        ? min(($obtenido / $minimo) * 100, 100)
                        : 100;
                }
                // Si no tiene la aptitud, contribución = 0 (se suma 0)
            }

            $porcentaje = round($totalScore / $totalAptitudes, 2);
            $compatible = $porcentaje >= 70;

            $match = MatchVacante::updateOrCreate(
                ['id_empleado' => $empleado->id_empleado, 'id_vacante' => $id_vacante],
                [
                    'porcentaje_compatibilidad' => $porcentaje,
                    'resultado'                 => $compatible ? 'compatible' : 'no_compatible',
                    'estado_proceso'            => 'pendiente',
                    'fecha_match'               => now()->toDateString(),
                ]
            );

            $resultados[] = $match->load('empleado');
        }

        return response()->json([
            'success' => true,
            'data'    => $resultados,
            'message' => 'Cálculo completado para ' . count($resultados) . ' empleados.',
        ]);
    }

    public function updateEstado(Request $request, $id)
    {
        $request->validate([
            'estado_proceso' => 'required|in:pendiente,en_evaluacion,aprobado,rechazado',
        ]);

        $match = MatchVacante::findOrFail($id);
        $match->update(['estado_proceso' => $request->estado_proceso]);

        return response()->json([
            'success' => true,
            'data'    => $match->load('empleado', 'vacante.puesto'),
            'message' => 'Estado actualizado.',
        ]);
    }

    /**
     * Devuelve los resultados de evaluación del empleado autenticado.
     */
    public function miEvaluacion(Request $request)
    {
        $usuario = $request->user();

        if (!$usuario->id_empleado) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de empleado asociado.',
            ], 404);
        }

        $matches = MatchVacante::with('vacante.puesto', 'vacante.area')
            ->where('id_empleado', $usuario->id_empleado)
            ->orderBy('fecha_match', 'desc')
            ->get();

        $empleado = $usuario->empleado()->with('puesto', 'area', 'aptitudes')->first();

        return response()->json([
            'success' => true,
            'data'    => [
                'empleado' => $empleado,
                'matches'  => $matches,
            ],
        ]);
    }
}
