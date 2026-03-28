<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CodigoRecuperacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'correo'     => 'required|email',
            'contrasena' => 'required|string',
        ]);

        $usuario = User::with('rol', 'empleado.puesto', 'empleado.area')
            ->where('correo', $request->correo)
            ->first();

        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'usuario' => $usuario,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true, 'message' => 'Sesión cerrada.']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user()->load('rol', 'empleado.puesto', 'empleado.area'),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['correo' => 'required|email']);

        // No revelar si el correo existe o no
        if (!User::where('correo', $request->correo)->exists()) {
            return response()->json(['success' => true, 'message' => 'Si el correo existe recibirás un código.']);
        }

        $codigo = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        CodigoRecuperacion::where('correo', $request->correo)->delete();

        CodigoRecuperacion::create([
            'correo'     => $request->correo,
            'codigo'     => $codigo,
            'expiracion' => now()->addMinutes(15),
        ]);

        // En producción enviar por correo. Por ahora se devuelve en la respuesta.
        return response()->json([
            'success' => true,
            'message' => 'Código generado.',
            'codigo'  => $codigo, // Quitar en producción
        ]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'codigo' => 'required|string',
        ]);

        $valido = CodigoRecuperacion::where('correo', $request->correo)
            ->where('codigo', $request->codigo)
            ->where('usado', false)
            ->where('expiracion', '>', now())
            ->exists();

        if (!$valido) {
            return response()->json(['success' => false, 'message' => 'Código inválido o expirado.'], 422);
        }

        return response()->json(['success' => true, 'message' => 'Código válido.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'correo'           => 'required|email',
            'codigo'           => 'required|string',
            'nueva_contrasena' => 'required|string|min:6',
        ]);

        $registro = CodigoRecuperacion::where('correo', $request->correo)
            ->where('codigo', $request->codigo)
            ->where('usado', false)
            ->where('expiracion', '>', now())
            ->first();

        if (!$registro) {
            return response()->json(['success' => false, 'message' => 'Código inválido o expirado.'], 422);
        }

        $usuario = User::where('correo', $request->correo)->first();

        if (!$usuario) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado.'], 404);
        }

        $usuario->update(['contrasena' => Hash::make($request->nueva_contrasena)]);
        $registro->update(['usado' => true]);

        return response()->json(['success' => true, 'message' => 'Contraseña actualizada correctamente.']);
    }
}
