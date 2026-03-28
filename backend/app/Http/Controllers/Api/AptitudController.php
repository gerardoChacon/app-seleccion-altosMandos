<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aptitud;
use Illuminate\Http\Request;

class AptitudController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Aptitud::orderBy('nombre_aptitud')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_aptitud' => 'required|string|max:100|unique:aptitud,nombre_aptitud',
            'descripcion'    => 'nullable|string',
        ]);

        $aptitud = Aptitud::create($request->only(['nombre_aptitud', 'descripcion']));

        return response()->json(['success' => true, 'data' => $aptitud, 'message' => 'Aptitud creada.'], 201);
    }

    public function update(Request $request, $id)
    {
        $aptitud = Aptitud::findOrFail($id);

        $request->validate([
            'nombre_aptitud' => "sometimes|string|max:100|unique:aptitud,nombre_aptitud,{$id},id_aptitud",
            'descripcion'    => 'nullable|string',
        ]);

        $aptitud->update($request->only(['nombre_aptitud', 'descripcion']));

        return response()->json(['success' => true, 'data' => $aptitud, 'message' => 'Aptitud actualizada.']);
    }

    public function destroy($id)
    {
        Aptitud::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Aptitud eliminada.']);
    }
}
