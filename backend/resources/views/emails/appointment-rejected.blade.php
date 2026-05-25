<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="utf-8">
    <title>{{ __('messages.appointment_rejected_title') }}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #dc2626; margin-bottom: 20px;">{{ __('messages.appointment_rejected_title') }}</h1>
        <p>{{ __('messages.dear') }} {{ $appointment->patient->user->name }}،</p>
        <p>{!! __('messages.appointment_rejected_body') !!}</p>
        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>{{ __('messages.date_label') }}</strong> {{ \Carbon\Carbon::parse($appointment->appointment_date)->locale('ar')->translatedFormat('j F Y') }}</p>
            <p style="margin: 5px 0;"><strong>{{ __('messages.time_label') }}</strong> {{ \Carbon\Carbon::parse($appointment->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($appointment->end_time)->format('H:i') }}</p>
            @if ($appointment->cancellation_reason)
            <p style="margin: 5px 0;"><strong>{{ __('messages.reason_label') }}</strong> {{ $appointment->cancellation_reason }}</p>
            @endif
        </div>
        <p>{{ __('messages.rejected_instruction') }}</p>
        <p>{!! __('messages.best_regards') !!}</p>
    </div>
</body>
</html>
