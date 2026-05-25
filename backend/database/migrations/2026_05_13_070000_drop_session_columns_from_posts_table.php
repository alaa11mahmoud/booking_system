<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['session_date', 'start_time', 'session_time']);
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->date('session_date')->nullable();
            $table->time('start_time')->nullable();
            $table->integer('session_time')->nullable();
        });
    }
};
