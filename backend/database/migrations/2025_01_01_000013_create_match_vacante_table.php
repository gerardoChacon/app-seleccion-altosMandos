<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_vacante', function (Blueprint $table) {
            $table->increments('id_match');
            $table->unsignedInteger('id_empleado');
            $table->unsignedInteger('id_vacante');
            $table->decimal('porcentaje_compatibilidad', 5, 2);
            $table->string('resultado', 20);
            $table->string('estado_proceso', 20)->default('pendiente');
            $table->date('fecha_match');
            $table->unique(['id_empleado', 'id_vacante']);

            $table->foreign('id_empleado')
                ->references('id_empleado')->on('empleado')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_vacante')
                ->references('id_vacante')->on('vacante')
                ->onUpdate('cascade')->onDelete('cascade');
        });

        DB::statement("ALTER TABLE match_vacante ADD CONSTRAINT chk_resultado CHECK (resultado IN ('compatible','no_compatible'))");
        DB::statement("ALTER TABLE match_vacante ADD CONSTRAINT chk_estado_proceso CHECK (estado_proceso IN ('pendiente','en_evaluacion','aprobado','rechazado'))");
        DB::statement('ALTER TABLE match_vacante ADD CONSTRAINT chk_pct_compatibilidad CHECK (porcentaje_compatibilidad >= 0 AND porcentaje_compatibilidad <= 100)');
    }

    public function down(): void
    {
        Schema::dropIfExists('match_vacante');
    }
};
