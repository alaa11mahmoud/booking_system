<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('appointments.{patientId}', function ($user, $patientId) {
    return (int) $user->id === (int) $patientId;
});
