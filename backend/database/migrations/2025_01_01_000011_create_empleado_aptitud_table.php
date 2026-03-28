<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empleado_aptitud', function (Blueprint $table) {
            $table->unsignedInteger('id_empleado');
            $table->unsignedInteger('id_aptitud');
            $table->decimal('porcentaje_obtenido', 5, 2);
            $table->primary(['id_empleado', 'id_aptitud']);

            $table->foreign('id_empleado')
                ->references('id_empleado')->on('empleado')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_aptitud')
                ->references('id_aptitud')->on('aptitud')
                ->onUpdate('cascade')->onDelete('restrict');
        });

        DB::statement('ALTER TABLE empleado_aptitud ADD CONSTRAINT chk_pct_obtenido CHECK (porcentaje_obtenido >= 0 AND porcentaje_obtenido <= 100)');
    }

    public function down(): void
    {
        Schema::dropIfExists('empleado_aptitud');
    }
};
