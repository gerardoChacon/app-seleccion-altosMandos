<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->string('correo', 150)->unique();
            $table->text('contrasena');
            $table->unsignedInteger('id_rol');
            $table->unsignedInteger('id_empleado')->nullable()->unique();
            $table->timestamps();

            $table->foreign('id_rol')
                ->references('id_rol')->on('rol')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_empleado')
                ->references('id_empleado')->on('empleado')
                ->onUpdate('cascade')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
