<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacante', function (Blueprint $table) {
            $table->increments('id_vacante');
            $table->unsignedInteger('id_puesto');
            $table->unsignedInteger('id_area');
            $table->text('descripcion')->nullable();
            $table->date('fecha_apertura');
            $table->string('estatus', 20)->default('disponible');
            $table->timestamps();

            $table->foreign('id_puesto')
                ->references('id_puesto')->on('puesto')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_area')
                ->references('id_area')->on('area')
                ->onUpdate('cascade')->onDelete('restrict');
        });

        DB::statement("ALTER TABLE vacante ADD CONSTRAINT chk_estatus_vacante CHECK (estatus IN ('disponible','no_disponible'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('vacante');
    }
};
