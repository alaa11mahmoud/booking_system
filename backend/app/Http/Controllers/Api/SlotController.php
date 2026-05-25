<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SlotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    public function __construct(
        private SlotService $slotService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $slots = $this->slotService->getAvailableSlots($validated['date']);

        return response()->json([
            'date' => $validated['date'],
            'slots' => $slots,
        ]);
    }
}
