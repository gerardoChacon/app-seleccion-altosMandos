<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rol', function (Blueprint $table) {
            $table->increments('id_rol');
            $table->string('nombre_rol', 50)->unique();
        });

        DB::statement("ALTER TABLE rol ADD CONSTRAINT chk_nombre_rol CHECK (nombre_rol IN ('superadmin','admin','empleado'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('rol');
    }
};
