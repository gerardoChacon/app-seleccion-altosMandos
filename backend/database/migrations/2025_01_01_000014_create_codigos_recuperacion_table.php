<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('codigos_recuperacion', function (Blueprint $table) {
            $table->increments('id');
            $table->string('correo', 150)->index();
            $table->string('codigo', 10);
            $table->timestamp('expiracion');
            $table->boolean('usado')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('codigos_recuperacion');
    }
};
