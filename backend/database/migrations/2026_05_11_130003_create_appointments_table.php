<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('patient_notes')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['appointment_date', 'status']);
            $table->index(['patient_id', 'appointment_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
