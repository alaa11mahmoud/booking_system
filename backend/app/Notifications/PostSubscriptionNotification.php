<?php

namespace App\Notifications;

use App\Models\PostSubscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostSubscriptionNotification extends Notification
{
    use Queueable;

    public PostSubscription $subscription;

    public function __construct(PostSubscription $subscription)
    {
        $this->subscription = $subscription;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'post_title' => $this->subscription->post->title,
            'patient_name' => $this->subscription->patient->user->name,
            'message' => 'اشتراك جديد: ' . $this->subscription->post->title,
        ];
    }
}
