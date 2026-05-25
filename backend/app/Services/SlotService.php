<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\WorkingHour;
use Carbon\Carbon;

class SlotService
{
    const SLOT_DURATION_MINUTES = 60;

    public function getAvailableSlots(string $date): array
    {
        $dateCarbon = Carbon::parse($date);
        $dayOfWeek = $dateCarbon->dayOfWeek;

        $workingHours = WorkingHour::where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->get();

        if ($workingHours->isEmpty()) {
            return [];
        }

        $bookedSlots = Appointment::where('appointment_date', $date)
            ->whereIn('status', ['pending', 'approved'])
            ->get(['start_time', 'end_time']);

        $slots = [];

        foreach ($workingHours as $wh) {
            $start = Carbon::parse($wh->start_time);
            $end = Carbon::parse($wh->end_time);

            while ($start->copy()->addMinutes(self::SLOT_DURATION_MINUTES)->lessThanOrEqualTo($end)) {
                $slotStart = $start->format('H:i');
                $slotEnd = $start->copy()->addMinutes(self::SLOT_DURATION_MINUTES)->format('H:i');

                if (!$this->isSlotBooked($slotStart, $slotEnd, $bookedSlots)) {
                    $slots[] = [
                        'start_time' => $slotStart,
                        'end_time' => $slotEnd,
                        'formatted' => $start->format('H:i') . ' - ' . $start->copy()->addMinutes(self::SLOT_DURATION_MINUTES)->format('H:i'),
                    ];
                }

                $start->addMinutes(self::SLOT_DURATION_MINUTES);
            }
        }

        return $slots;
    }

    private function isSlotBooked(string $startTime, string $endTime, iterable $bookedSlots): bool
    {
        foreach ($bookedSlots as $booked) {
            $bookedStart = $booked->start_time instanceof \Carbon\Carbon
                ? $booked->start_time->format('H:i')
                : $booked->start_time;
            $bookedEnd = $booked->end_time instanceof \Carbon\Carbon
                ? $booked->end_time->format('H:i')
                : $booked->end_time;

            if ($startTime < $bookedEnd && $endTime > $bookedStart) {
                return true;
            }
        }
        return false;
    }
}
