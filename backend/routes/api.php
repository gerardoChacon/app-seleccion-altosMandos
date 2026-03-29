<?php

use App\Http\Controllers\Api\AptitudController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogosController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\PuestoController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\VacanteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas públicas (sin autenticación)
|--------------------------------------------------------------------------
*/
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- Autenticación ---
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // --- Catálogos (accesibles para todos los roles) ---
    Route::get('/estados', [CatalogosController::class, 'estados']);
    Route::get('/municipios', [CatalogosController::class, 'municipios']);
    Route::get('/aptitudes', [AptitudController::class, 'index']);
    Route::get('/areas', [AreaController::class, 'index']);
    Route::get('/puestos', [PuestoController::class, 'index']);

    // --- Vacantes (lectura accesible para todos los roles) ---
    Route::get('/vacantes', [VacanteController::class, 'index']);
    Route::get('/vacantes/{id}', [VacanteController::class, 'show']);
    Route::post('/vacantes/{id}/aplicar', [MatchController::class, 'aplicar']);

    // --- Empleado: ver su propio perfil ---
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    Route::get('/empleados/{id}/aptitudes', [EmpleadoController::class, 'aptitudes']);

    // --- Mi evaluación (empleado ve sus propios resultados) ---
    Route::get('/mi-evaluacion', [MatchController::class, 'miEvaluacion']);

    /*
    |----------------------------------------------------------------------
    | Rutas solo para admin y superadmin
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin,superadmin')->group(function () {

        // --- Dashboard ---
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // --- Empleados (gestión completa) ---
        Route::get('/empleados', [EmpleadoController::class, 'index']);
        Route::post('/empleados', [EmpleadoController::class, 'store']);
        Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);
        Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);
        Route::post('/empleados/{id}/foto', [EmpleadoController::class, 'uploadFoto']);
        Route::post('/empleados/{id}/cv', [EmpleadoController::class, 'uploadCv']);
        Route::post('/empleados/{id}/aptitudes', [EmpleadoController::class, 'guardarAptitudes']);

        // --- Vacantes (creación y edición) ---
        Route::post('/vacantes', [VacanteController::class, 'store']);
        Route::put('/vacantes/{id}', [VacanteController::class, 'update']);
        Route::delete('/vacantes/{id}', [VacanteController::class, 'destroy']);

        // --- Aptitudes (gestión) ---
        Route::post('/aptitudes', [AptitudController::class, 'store']);
        Route::put('/aptitudes/{id}', [AptitudController::class, 'update']);
        Route::delete('/aptitudes/{id}', [AptitudController::class, 'destroy']);

        // --- Matches / Evaluaciones ---
        Route::get('/matches', [MatchController::class, 'index']);
        Route::post('/matches/calcular/{id_vacante}', [MatchController::class, 'calcular']);
        Route::put('/matches/{id}/estado', [MatchController::class, 'updateEstado']);
        Route::get('/vacantes/{id}/postulantes', [MatchController::class, 'postulantes']);

        // --- Áreas (gestión) ---
        Route::post('/areas', [AreaController::class, 'store']);
        Route::put('/areas/{id}', [AreaController::class, 'update']);
        Route::delete('/areas/{id}', [AreaController::class, 'destroy']);

        // --- Puestos (gestión) ---
        Route::post('/puestos', [PuestoController::class, 'store']);
        Route::put('/puestos/{id}', [PuestoController::class, 'update']);
        Route::delete('/puestos/{id}', [PuestoController::class, 'destroy']);
    });

    /*
    |----------------------------------------------------------------------
    | Rutas solo para superadmin
    |----------------------------------------------------------------------
    */
    Route::middleware('role:superadmin')->group(function () {

        // --- Usuarios (gestión de accesos) ---
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::post('/usuarios', [UsuarioController::class, 'store']);
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
        Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
    });
});
