<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aptitud', function (Blueprint $table) {
            $table->increments('id_aptitud');
            $table->string('nombre_aptitud', 100)->unique();
            $table->text('descripcion')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aptitud');
    }
};
