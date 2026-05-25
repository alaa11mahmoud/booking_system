<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Events\AppointmentStatusUpdated;
use App\Http\Controllers\Controller;
use App\Mail\AppointmentApprovedMail;
use App\Mail\AppointmentRejectedMail;
use App\Models\Appointment;
use App\Models\Patient;
use App\Services\SlotService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function __construct(
        private SlotService $slotService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Appointment::with('patient.user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);

            if ($user->isAdmin()) {
                $appointments = $query->orderBy('appointment_date', 'asc')
                    ->orderBy('start_time', 'asc')
                    ->paginate(20);
            } else {
                $patient = $user->patient;
                $appointments = $query->where('patient_id', $patient->id)
                    ->orderBy('appointment_date', 'asc')
                    ->orderBy('start_time', 'asc')
                    ->paginate(20);
            }
        } else {
            if ($user->isAdmin()) {
                $appointments = $query->orderBy('appointment_date', 'desc')
                    ->orderBy('start_time', 'desc')
                    ->paginate(20);
            } else {
                $patient = $user->patient;
                $appointments = $query->where('patient_id', $patient->id)
                    ->orderBy('appointment_date', 'desc')
                    ->orderBy('start_time', 'desc')
                    ->paginate(20);
            }
        }

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'patient_notes' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $patient = $user->patient ?? $user->patient()->create();

        $startTime = $validated['start_time'];
        $endTime = Carbon::parse($startTime)->addMinutes(SlotService::SLOT_DURATION_MINUTES)->format('H:i');

        $availableSlots = $this->slotService->getAvailableSlots($validated['appointment_date']);
        $isAvailable = collect($availableSlots)->first(fn ($slot) => $slot['start_time'] === $startTime);

        if (!$isAvailable) {
            return response()->json(['message' => __('messages.slot_not_available')], 409);
        }

        $overlap = Appointment::where('appointment_date', $validated['appointment_date'])
            ->whereIn('status', [AppointmentStatus::Pending->value, AppointmentStatus::Approved->value])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime);
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => __('messages.slot_taken')], 409);
        }

        $status = $user->isAdmin() ? AppointmentStatus::Approved : AppointmentStatus::Pending;

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => $status,
            'patient_notes' => $validated['patient_notes'] ?? null,
        ]);

        $appointment->load('patient.user');

        $admin = \App\Models\User::where('role', \App\Enums\UserRole::Admin)->first();
        if ($admin) {
            $admin->notify(new \App\Notifications\AppointmentStatusNotification($appointment));
        }

        return response()->json($appointment->load('patient.user'), 201);
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin() && $appointment->patient_id !== $user->patient->id) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        return response()->json($appointment->load('patient.user'));
    }

    public function updateStatus(Request $request, Appointment $appointment): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        if ($appointment->status !== AppointmentStatus::Pending) {
            return response()->json(['message' => __('messages.appointment_already', ['status' => $appointment->status->label()])], 409);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:approved,rejected',
            'appointment_date' => 'nullable|date|after_or_equal:today',
            'start_time' => 'nullable|date_format:H:i',
            'rejection_reason' => 'nullable|string|max:1000',
        ]);

        $updateData = [
            'status' => AppointmentStatus::from($validated['status']),
            'cancellation_reason' => $validated['rejection_reason'] ?? null,
        ];

        if ($validated['status'] === AppointmentStatus::Approved->value) {
            if ($validated['appointment_date']) {
                $updateData['appointment_date'] = $validated['appointment_date'];
            }
            if ($validated['start_time']) {
                $updateData['start_time'] = $validated['start_time'];
                $updateData['end_time'] = Carbon::parse($validated['start_time'])->addMinutes(\App\Services\SlotService::SLOT_DURATION_MINUTES)->format('H:i');
            }
        }

        $appointment->update($updateData);

        $appointment->load('patient.user');

        if ($validated['status'] === AppointmentStatus::Approved->value) {
            Mail::to($appointment->patient->user->email)
                ->send(new AppointmentApprovedMail($appointment));
        } else {
            Mail::to($appointment->patient->user->email)
                ->send(new AppointmentRejectedMail($appointment));
        }

        $user = $appointment->patient->user;
        $user->notify(new \App\Notifications\AppointmentStatusNotification($appointment));

        broadcast(new AppointmentStatusUpdated($appointment))->toOthers();

        return response()->json($appointment);
    }

    public function completePast(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $count = Appointment::where('status', AppointmentStatus::Approved)
            ->where('appointment_date', '<', Carbon::today())
            ->update(['status' => AppointmentStatus::Completed]);

        return response()->json(['message' => __('messages.completed_past', ['count' => $count]), 'count' => $count]);
    }
}
