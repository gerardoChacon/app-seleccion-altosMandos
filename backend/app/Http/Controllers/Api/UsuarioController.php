<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => User::with('rol', 'empleado')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'correo'       => 'required|email|unique:usuario,correo',
            'contrasena'   => 'required|string|min:6',
            'id_rol'       => 'required|exists:rol,id_rol',
            'id_empleado'  => 'nullable|exists:empleado,id_empleado|unique:usuario,id_empleado',
        ]);

        $usuario = User::create([
            'correo'      => $request->correo,
            'contrasena'  => Hash::make($request->contrasena),
            'id_rol'      => $request->id_rol,
            'id_empleado' => $request->id_empleado,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $usuario->load('rol', 'empleado'),
            'message' => 'Usuario creado.',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $usuario = User::findOrFail($id);

        $request->validate([
            'correo'      => "sometimes|email|unique:usuario,correo,{$id},id_usuario",
            'contrasena'  => 'sometimes|string|min:6',
            'id_rol'      => 'sometimes|exists:rol,id_rol',
            'id_empleado' => "nullable|exists:empleado,id_empleado|unique:usuario,id_empleado,{$id},id_usuario",
        ]);

        $data = $request->only(['correo', 'id_rol', 'id_empleado']);

        if ($request->filled('contrasena')) {
            $data['contrasena'] = Hash::make($request->contrasena);
        }

        $usuario->update($data);

        return response()->json([
            'success' => true,
            'data'    => $usuario->load('rol', 'empleado'),
            'message' => 'Usuario actualizado.',
        ]);
    }

    public function destroy($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->tokens()->delete();
        $usuario->delete();

        return response()->json(['success' => true, 'message' => 'Usuario eliminado.']);
    }
}
