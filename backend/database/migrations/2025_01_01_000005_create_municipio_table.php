<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('municipio', function (Blueprint $table) {
            $table->increments('id_municipio');
            $table->string('nombre_municipio', 100);
            $table->unsignedInteger('id_estado');
            $table->unique(['nombre_municipio', 'id_estado']);
            $table->foreign('id_estado')
                ->references('id_estado')->on('estado')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('municipio');
    }
};
