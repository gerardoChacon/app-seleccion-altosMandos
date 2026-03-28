<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vacante;
use Illuminate\Http\Request;

class VacanteController extends Controller
{
    public function index(Request $request)
    {
        $query = Vacante::with('puesto', 'area', 'aptitudes');

        if ($request->filled('estatus')) {
            $query->where('estatus', $request->estatus);
        }

        if ($request->filled('id_area')) {
            $query->where('id_area', $request->id_area);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->orderBy('fecha_apertura', 'desc')->paginate($request->get('per_page', 15)),
        ]);
    }

    public function show($id)
    {
        $vacante = Vacante::with('puesto', 'area', 'aptitudes', 'matches.empleado.puesto')->findOrFail($id);

        return response()->json(['success' => true, 'data' => $vacante]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_puesto'                        => 'required|exists:puesto,id_puesto',
            'id_area'                          => 'required|exists:area,id_area',
            'descripcion'                      => 'nullable|string',
            'fecha_apertura'                   => 'required|date',
            'estatus'                          => 'required|in:disponible,no_disponible',
            'aptitudes'                        => 'nullable|array',
            'aptitudes.*.id_aptitud'           => 'exists:aptitud,id_aptitud',
            'aptitudes.*.porcentaje_minimo'    => 'numeric|min:0|max:100',
        ]);

        $vacante = Vacante::create($request->only(['id_puesto', 'id_area', 'descripcion', 'fecha_apertura', 'estatus']));

        if ($request->filled('aptitudes')) {
            foreach ($request->aptitudes as $apt) {
                $vacante->aptitudes()->attach(
                    $apt['id_aptitud'],
                    ['porcentaje_minimo' => $apt['porcentaje_minimo']]
                );
            }
        }

        return response()->json([
            'success' => true,
            'data'    => $vacante->load('puesto', 'area', 'aptitudes'),
            'message' => 'Vacante creada.',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $vacante = Vacante::findOrFail($id);

        $request->validate([
            'id_puesto'                     => 'sometimes|exists:puesto,id_puesto',
            'id_area'                       => 'sometimes|exists:area,id_area',
            'descripcion'                   => 'nullable|string',
            'fecha_apertura'                => 'sometimes|date',
            'estatus'                       => 'sometimes|in:disponible,no_disponible',
            'aptitudes'                     => 'nullable|array',
            'aptitudes.*.id_aptitud'        => 'exists:aptitud,id_aptitud',
            'aptitudes.*.porcentaje_minimo' => 'numeric|min:0|max:100',
        ]);

        $vacante->update($request->only(['id_puesto', 'id_area', 'descripcion', 'fecha_apertura', 'estatus']));

        if ($request->has('aptitudes')) {
            $syncData = [];
            foreach ($request->aptitudes as $apt) {
                $syncData[$apt['id_aptitud']] = ['porcentaje_minimo' => $apt['porcentaje_minimo']];
            }
            $vacante->aptitudes()->sync($syncData);
        }

        return response()->json([
            'success' => true,
            'data'    => $vacante->load('puesto', 'area', 'aptitudes'),
            'message' => 'Vacante actualizada.',
        ]);
    }

    public function destroy($id)
    {
        $vacante = Vacante::findOrFail($id);
        $vacante->update(['estatus' => 'no_disponible']);

        return response()->json(['success' => true, 'message' => 'Vacante desactivada.']);
    }
}
