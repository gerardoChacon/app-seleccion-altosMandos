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

    // --- Dashboard ---
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // --- Empleados ---
    Route::get('/empleados', [EmpleadoController::class, 'index']);
    Route::post('/empleados', [EmpleadoController::class, 'store']);
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);
    Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);
    Route::post('/empleados/{id}/foto', [EmpleadoController::class, 'uploadFoto']);
    Route::post('/empleados/{id}/cv', [EmpleadoController::class, 'uploadCv']);
    Route::get('/empleados/{id}/aptitudes', [EmpleadoController::class, 'aptitudes']);
    Route::post('/empleados/{id}/aptitudes', [EmpleadoController::class, 'guardarAptitudes']);

    // --- Vacantes ---
    Route::get('/vacantes', [VacanteController::class, 'index']);
    Route::post('/vacantes', [VacanteController::class, 'store']);
    Route::get('/vacantes/{id}', [VacanteController::class, 'show']);
    Route::put('/vacantes/{id}', [VacanteController::class, 'update']);
    Route::delete('/vacantes/{id}', [VacanteController::class, 'destroy']);

    // --- Aptitudes ---
    Route::get('/aptitudes', [AptitudController::class, 'index']);
    Route::post('/aptitudes', [AptitudController::class, 'store']);
    Route::put('/aptitudes/{id}', [AptitudController::class, 'update']);
    Route::delete('/aptitudes/{id}', [AptitudController::class, 'destroy']);

    // --- Matches / Evaluaciones ---
    Route::get('/matches', [MatchController::class, 'index']);
    Route::post('/matches/calcular/{id_vacante}', [MatchController::class, 'calcular']);
    Route::put('/matches/{id}/estado', [MatchController::class, 'updateEstado']);
    Route::get('/mi-evaluacion', [MatchController::class, 'miEvaluacion']);

    // --- Áreas ---
    Route::get('/areas', [AreaController::class, 'index']);
    Route::post('/areas', [AreaController::class, 'store']);
    Route::put('/areas/{id}', [AreaController::class, 'update']);
    Route::delete('/areas/{id}', [AreaController::class, 'destroy']);

    // --- Puestos ---
    Route::get('/puestos', [PuestoController::class, 'index']);
    Route::post('/puestos', [PuestoController::class, 'store']);
    Route::put('/puestos/{id}', [PuestoController::class, 'update']);
    Route::delete('/puestos/{id}', [PuestoController::class, 'destroy']);

    // --- Catálogos (estados y municipios) ---
    Route::get('/estados', [CatalogosController::class, 'estados']);
    Route::get('/municipios', [CatalogosController::class, 'municipios']);

    // --- Usuarios ---
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
});
