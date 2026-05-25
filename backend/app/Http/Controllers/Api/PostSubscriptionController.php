<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostSubscription;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostSubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $subscriptions = PostSubscription::with('post', 'patient.user')
                ->latest()
                ->get();
        } else {
            $patient = $user->patient;
            if (!$patient) {
                return response()->json([]);
            }

            $subscriptions = PostSubscription::with('post')
                ->where('patient_id', $patient->id)
                ->latest()
                ->get();
        }

        return response()->json($subscriptions);
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();
        $patient = $user->patient ?? $user->patient()->create();

        if (!$post->is_active) {
            return response()->json(['message' => __('messages.not_found')], 404);
        }

        if ($post->end_date && now()->greaterThan($post->end_date)) {
            return response()->json(['message' => __('messages.session_ended')], 410);
        }

        $exists = PostSubscription::where('post_id', $post->id)
            ->where('patient_id', $patient->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => __('messages.already_subscribed')], 409);
        }

        $count = PostSubscription::where('post_id', $post->id)->count();

        if ($post->max_members && $count >= $post->max_members) {
            return response()->json(['message' => __('messages.session_full')], 409);
        }

        $subscription = PostSubscription::create([
            'post_id' => $post->id,
            'patient_id' => $patient->id,
        ]);

        $admin = User::where('role', UserRole::Admin)->first();
        if ($admin) {
            $admin->notify(new \App\Notifications\PostSubscriptionNotification($subscription));
        }

        return response()->json($subscription->load('post', 'patient.user'), 201);
    }

    public function destroy(Request $request, PostSubscription $postSubscription): JsonResponse
    {
        $user = $request->user();
        $patient = $user->patient;

        if (!$user->isAdmin() && (!$patient || $postSubscription->patient_id !== $patient->id)) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $postSubscription->delete();

        return response()->json(['message' => __('messages.subscription_cancelled')]);
    }
}
