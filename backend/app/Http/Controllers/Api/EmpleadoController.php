<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Direccion;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        $query = Empleado::with('puesto', 'area', 'direccion.municipio.estado');

        if ($request->filled('buscar')) {
            $buscar = $request->buscar;
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('apellido_paterno', 'ilike', "%{$buscar}%")
                  ->orWhere('apellido_materno', 'ilike', "%{$buscar}%")
                  ->orWhere('curp', 'ilike', "%{$buscar}%")
                  ->orWhere('rfc', 'ilike', "%{$buscar}%");
            });
        }

        if ($request->filled('id_area')) {
            $query->where('id_area', $request->id_area);
        }

        if ($request->filled('estatus')) {
            $query->where('estatus', $request->estatus);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->paginate($request->get('per_page', 15)),
        ]);
    }

    public function show($id)
    {
        $empleado = Empleado::with(
            'puesto', 'area',
            'direccion.municipio.estado',
            'aptitudes',
            'matches.vacante.puesto',
            'usuario'
        )->findOrFail($id);

        return response()->json(['success' => true, 'data' => $empleado]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'           => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'curp'             => 'required|string|size:18|unique:empleado,curp',
            'nss'              => 'required|string|max:11|unique:empleado,nss',
            'fecha_ingreso'    => 'required|date',
            'fecha_nacimiento' => 'required|date',
            'rfc'              => 'required|string|max:13|unique:empleado,rfc',
            'correo'           => 'nullable|email|max:150|unique:empleado,correo',
            'id_puesto'        => 'required|exists:puesto,id_puesto',
            'id_area'          => 'required|exists:area,id_area',
            'calle'            => 'required|string|max:150',
            'numero'           => 'required|string|max:20',
            'colonia'          => 'required|string|max:100',
            'codigo_postal'    => 'required|string|max:10',
            'id_municipio'     => 'required|exists:municipio,id_municipio',
        ]);

        $empleado = DB::transaction(function () use ($request) {
            $direccion = Direccion::create([
                'calle'         => $request->calle,
                'numero'        => $request->numero,
                'colonia'       => $request->colonia,
                'codigo_postal' => $request->codigo_postal,
                'id_municipio'  => $request->id_municipio,
            ]);

            return Empleado::create([
                'nombre'           => $request->nombre,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'curp'             => strtoupper($request->curp),
                'nss'              => $request->nss,
                'fecha_ingreso'    => $request->fecha_ingreso,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'rfc'              => strtoupper($request->rfc),
                'correo'           => $request->correo,
                'id_puesto'        => $request->id_puesto,
                'id_area'          => $request->id_area,
                'id_direccion'     => $direccion->id_direccion,
                'estatus'          => 'activo',
            ]);
        });

        return response()->json([
            'success' => true,
            'data'    => $empleado->load('puesto', 'area', 'direccion.municipio.estado'),
            'message' => 'Empleado registrado correctamente.',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $request->validate([
            'nombre'           => 'sometimes|string|max:100',
            'apellido_paterno' => 'sometimes|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'curp'             => "sometimes|string|size:18|unique:empleado,curp,{$id},id_empleado",
            'nss'              => "sometimes|string|max:11|unique:empleado,nss,{$id},id_empleado",
            'fecha_ingreso'    => 'sometimes|date',
            'fecha_nacimiento' => 'sometimes|date',
            'rfc'              => "sometimes|string|max:13|unique:empleado,rfc,{$id},id_empleado",
            'correo'           => "nullable|email|max:150|unique:empleado,correo,{$id},id_empleado",
            'id_puesto'        => 'sometimes|exists:puesto,id_puesto',
            'id_area'          => 'sometimes|exists:area,id_area',
            'estatus'          => 'sometimes|in:activo,inactivo',
            'calle'            => 'sometimes|string|max:150',
            'numero'           => 'sometimes|string|max:20',
            'colonia'          => 'sometimes|string|max:100',
            'codigo_postal'    => 'sometimes|string|max:10',
            'id_municipio'     => 'sometimes|exists:municipio,id_municipio',
        ]);

        $empleado->update($request->only([
            'nombre', 'apellido_paterno', 'apellido_materno',
            'curp', 'nss', 'fecha_ingreso', 'fecha_nacimiento',
            'rfc', 'correo', 'id_puesto', 'id_area', 'estatus',
        ]));

        if ($request->hasAny(['calle', 'numero', 'colonia', 'codigo_postal', 'id_municipio'])) {
            $empleado->direccion->update(
                $request->only(['calle', 'numero', 'colonia', 'codigo_postal', 'id_municipio'])
            );
        }

        return response()->json([
            'success' => true,
            'data'    => $empleado->load('puesto', 'area', 'direccion.municipio.estado'),
            'message' => 'Empleado actualizado.',
        ]);
    }

    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->update(['estatus' => 'inactivo']);

        return response()->json(['success' => true, 'message' => 'Empleado desactivado.']);
    }

    public function uploadFoto(Request $request, $id)
    {
        $request->validate(['foto' => 'required|image|max:2048']);
        $empleado = Empleado::findOrFail($id);

        if ($empleado->fotografia) {
            Storage::disk('public')->delete($empleado->fotografia);
        }

        $path = $request->file('foto')->store("empleados/fotos/{$id}", 'public');
        $empleado->update(['fotografia' => $path]);

        return response()->json([
            'success' => true,
            'data'    => ['url' => Storage::url($path)],
        ]);
    }

    public function uploadCv(Request $request, $id)
    {
        $request->validate(['cv' => 'required|mimes:pdf|max:5120']);
        $empleado = Empleado::findOrFail($id);

        if ($empleado->cv) {
            Storage::disk('public')->delete($empleado->cv);
        }

        $path = $request->file('cv')->store("empleados/cvs/{$id}", 'public');
        $empleado->update(['cv' => $path]);

        return response()->json([
            'success' => true,
            'data'    => ['url' => Storage::url($path)],
        ]);
    }

    public function aptitudes($id)
    {
        $empleado = Empleado::with('aptitudes')->findOrFail($id);

        return response()->json(['success' => true, 'data' => $empleado->aptitudes]);
    }

    public function guardarAptitudes(Request $request, $id)
    {
        $request->validate([
            'aptitudes'                        => 'required|array',
            'aptitudes.*.id_aptitud'           => 'required|exists:aptitud,id_aptitud',
            'aptitudes.*.porcentaje_obtenido'  => 'required|numeric|min:0|max:100',
        ]);

        $empleado = Empleado::findOrFail($id);

        foreach ($request->aptitudes as $apt) {
            $empleado->aptitudes()->syncWithoutDetaching([
                $apt['id_aptitud'] => ['porcentaje_obtenido' => $apt['porcentaje_obtenido']],
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => $empleado->load('aptitudes'),
            'message' => 'Aptitudes guardadas.',
        ]);
    }
}
