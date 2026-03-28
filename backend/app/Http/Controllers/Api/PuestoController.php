<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puesto;
use Illuminate\Http\Request;

class PuestoController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Puesto::orderBy('nombre_puesto')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_puesto' => 'required|string|max:100|unique:puesto,nombre_puesto',
            'descripcion'   => 'nullable|string',
        ]);

        $puesto = Puesto::create($request->only(['nombre_puesto', 'descripcion']));

        return response()->json(['success' => true, 'data' => $puesto, 'message' => 'Puesto creado.'], 201);
    }

    public function update(Request $request, $id)
    {
        $puesto = Puesto::findOrFail($id);

        $request->validate([
            'nombre_puesto' => "sometimes|string|max:100|unique:puesto,nombre_puesto,{$id},id_puesto",
            'descripcion'   => 'nullable|string',
        ]);

        $puesto->update($request->only(['nombre_puesto', 'descripcion']));

        return response()->json(['success' => true, 'data' => $puesto, 'message' => 'Puesto actualizado.']);
    }

    public function destroy($id)
    {
        Puesto::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Puesto eliminado.']);
    }
}
