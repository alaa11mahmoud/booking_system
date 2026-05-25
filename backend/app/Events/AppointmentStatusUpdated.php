<?php

namespace App\Events;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class AppointmentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('appointments.' . $this->appointment->patient_id);
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->appointment->id,
            'status' => $this->appointment->status->value,
            'appointment_date' => Carbon::parse($this->appointment->appointment_date)->format('Y-m-d'),
            'start_time' => Carbon::parse($this->appointment->start_time)->format('H:i'),
            'end_time' => Carbon::parse($this->appointment->end_time)->format('H:i'),
            'rejection_reason' => $this->appointment->cancellation_reason,
        ];
    }
}
