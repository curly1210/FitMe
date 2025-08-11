<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification
{
    use Queueable;

    public $orderId;
    public $status;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $orderId, int $status, string $message)
    {
        $this->orderId = $orderId;
        $this->status  = $status;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    // Channels: lưu DB + gửi realtime
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail(object $notifiable): MailMessage
    // {
    //     return (new MailMessage)
    //         ->line('The introduction to the notification.')
    //         ->action('Notification Action', url('/'))
    //         ->line('Thank you for using our application!');
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    // Mảng lưu vào cột `data` của bảng notifications
    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->orderId,
            'status'   => $this->status,
            'message'  => $this->message,
        ];
    }

    // Payload gửi realtime qua Pusher (FE sẽ nhận object notification)
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'order_id' => $this->orderId,
            'status'   => $this->status,
            'message'  => $this->message,
        ]);
    }
}
