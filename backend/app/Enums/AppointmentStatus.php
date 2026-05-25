<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => __('messages.status_pending'),
            self::Approved => __('messages.status_approved'),
            self::Rejected => __('messages.status_rejected'),
            self::Completed => __('messages.status_completed'),
        };
    }
}
