<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Area::orderBy('nombre_area')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_area' => 'required|string|max:100|unique:area,nombre_area',
        ]);

        $area = Area::create($request->only(['nombre_area']));

        return response()->json(['success' => true, 'data' => $area, 'message' => 'Área creada.'], 201);
    }

    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $request->validate([
            'nombre_area' => "required|string|max:100|unique:area,nombre_area,{$id},id_area",
        ]);

        $area->update($request->only(['nombre_area']));

        return response()->json(['success' => true, 'data' => $area, 'message' => 'Área actualizada.']);
    }

    public function destroy($id)
    {
        Area::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Área eliminada.']);
    }
}
