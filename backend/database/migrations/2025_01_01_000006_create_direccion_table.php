<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('direccion', function (Blueprint $table) {
            $table->increments('id_direccion');
            $table->string('calle', 150);
            $table->string('numero', 20);
            $table->string('colonia', 100);
            $table->string('codigo_postal', 10);
            $table->unsignedInteger('id_municipio');
            $table->foreign('id_municipio')
                ->references('id_municipio')->on('municipio')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('direccion');
    }
};
