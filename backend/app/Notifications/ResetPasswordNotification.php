<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public function __construct(
        protected string $token,
        protected string $email,
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $frontendUrl = env('FRONTEND_URL', 'http://127.0.0.1:8000');
        $url = $frontendUrl . '/reset-password?token=' . $this->token . '&email=' . urlencode($this->email);

        return (new MailMessage)
            ->subject('إعادة تعيين كلمة المرور')
            ->greeting('مرحباً!')
            ->line('لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.')
            ->action('إعادة تعيين كلمة المرور', $url)
            ->line('إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.')
            ->salutation('مع تحيات، عيادة د. هالة');
    }
}
