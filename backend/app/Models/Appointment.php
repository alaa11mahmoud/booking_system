<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\AppointmentStatus;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_date',
        'start_time',
        'end_time',
        'status',
        'patient_notes',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date:Y-m-d',
            'start_time' => 'string',
            'end_time' => 'string',
            'status' => AppointmentStatus::class,
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

}
