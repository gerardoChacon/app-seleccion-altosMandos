<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estado;
use App\Models\Municipio;
use Illuminate\Http\Request;

class CatalogosController extends Controller
{
    public function estados()
    {
        return response()->json([
            'success' => true,
            'data'    => Estado::orderBy('nombre_estado')->get(),
        ]);
    }

    public function municipios(Request $request)
    {
        $query = Municipio::with('estado')->orderBy('nombre_municipio');

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        return response()->json(['success' => true, 'data' => $query->get()]);
    }
}
