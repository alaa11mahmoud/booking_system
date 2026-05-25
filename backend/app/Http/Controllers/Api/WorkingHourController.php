<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkingHour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkingHourController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        $hours = WorkingHour::orderBy('day_of_week')->orderBy('start_time')->get();

        return response()->json($hours);
    }

    public function update(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'hours' => 'required|array',
            'hours.*.day_of_week' => 'required|integer|between:0,6',
            'hours.*.start_time' => 'required|date_format:H:i',
            'hours.*.end_time' => 'required|date_format:H:i|after:hours.*.start_time',
            'hours.*.is_active' => 'boolean',
        ]);

        WorkingHour::truncate();

        foreach ($validated['hours'] as $hour) {
            WorkingHour::create([
                'day_of_week' => $hour['day_of_week'],
                'start_time' => $hour['start_time'],
                'end_time' => $hour['end_time'],
                'is_active' => $hour['is_active'] ?? true,
            ]);
        }

        return response()->json(['message' => __('messages.working_hours_updated')]);
    }
}
