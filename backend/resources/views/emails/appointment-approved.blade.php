<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="utf-8">
    <title>{{ __('messages.appointment_approved_title') }}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #059669; margin-bottom: 20px;">{{ __('messages.appointment_approved_title') }}</h1>
        <p>{{ __('messages.dear') }} {{ $appointment->patient->user->name }}،</p>
        <p>{!! __('messages.appointment_approved_body') !!}</p>
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>{{ __('messages.date_label') }}</strong> {{ \Carbon\Carbon::parse($appointment->appointment_date)->locale('ar')->translatedFormat('j F Y') }}</p>
            <p style="margin: 5px 0;"><strong>{{ __('messages.time_label') }}</strong> {{ \Carbon\Carbon::parse($appointment->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($appointment->end_time)->format('H:i') }}</p>
        </div>
        <p>{{ __('messages.approved_instruction') }}</p>
        <p>{!! __('messages.best_regards') !!}</p>
    </div>
</body>
</html>
