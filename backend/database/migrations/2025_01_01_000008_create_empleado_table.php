<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empleado', function (Blueprint $table) {
            $table->increments('id_empleado');
            $table->string('nombre', 100);
            $table->string('apellido_paterno', 100);
            $table->string('apellido_materno', 100)->nullable();
            $table->string('curp', 18)->unique();
            $table->string('nss', 11)->unique();
            $table->date('fecha_ingreso');
            $table->date('fecha_nacimiento');
            $table->string('rfc', 13)->unique();
            $table->string('correo', 150)->nullable()->unique();
            $table->text('fotografia')->nullable();
            $table->text('cv')->nullable();
            $table->unsignedInteger('id_puesto');
            $table->unsignedInteger('id_area');
            $table->unsignedInteger('id_direccion');
            $table->string('estatus', 20)->default('activo');
            $table->timestamps();

            $table->foreign('id_puesto')
                ->references('id_puesto')->on('puesto')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_area')
                ->references('id_area')->on('area')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_direccion')
                ->references('id_direccion')->on('direccion')
                ->onUpdate('cascade')->onDelete('restrict');
        });

        DB::statement("ALTER TABLE empleado ADD CONSTRAINT chk_estatus_empleado CHECK (estatus IN ('activo','inactivo'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('empleado');
    }
};
