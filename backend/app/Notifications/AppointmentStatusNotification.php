<?php

namespace App\Notifications;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentStatusNotification extends Notification
{
    use Queueable;

    public Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $data = [
            'appointment_id' => $this->appointment->id,
            'status' => $this->appointment->status->value,
            'appointment_date' => $this->appointment->appointment_date ? Carbon::parse($this->appointment->appointment_date)->format('Y-m-d') : null,
            'start_time' => $this->appointment->start_time ? Carbon::parse($this->appointment->start_time)->format('H:i') : null,
            'patient_name' => $this->appointment->patient?->user?->name,
            'message' => __('messages.notification_message_' . $this->appointment->status->value),
        ];

        if ($this->appointment->cancellation_reason) {
            $data['rejection_reason'] = $this->appointment->cancellation_reason;
        }

        return $data;
    }
}
