<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Log;

class OrderStatusNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $orderId;
    public $status;
    public $message;
    public $userId;
    public $isAdmin = 0;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $userId, string $orderId, int $status, string $message, int $isAdmin = 0)

    {
        $this->userId = $userId;
        $this->orderId = $orderId;
        $this->status  = $status;
        $this->message = $message;
        $this->isAdmin = $isAdmin; // 1 nếu là admin, 0 nếu là user
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
            'user_id' => $this->userId,
            'order_id' => $this->orderId,
            'status'   => $this->status,
            'message'  => $this->message,
            'icon' => '📦'
        ];
    }

    // Payload gửi realtime qua Pusher (FE sẽ nhận object notification)
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'user_id' => $this->userId,
            'order_id' => $this->orderId,
            'status'   => $this->status,
            'message'  => $this->message,
            'icon' => '📦'
        ]);
    }

    public function broadcastOn()
    {
        // $notifiable là instance của User đang nhận
        if ($this->isAdmin === 1) {
            // kênh riêng cho admin
            return new PrivateChannel('admin.notifications');
        }
        return new PrivateChannel('App.Models.User.' . $this->userId);
        // return new PrivateChannel('App.Models.User.' . $this->userId);
    }

    public function broadcastAs()
    {
        // return 'order.updated';
        return 'order';
    }

    // protected function isAdmin($userId)
    // {
    //     // $user = \App\Models\User::find($userId);
    //     $user = User::find($userId);
    //     return $user && $user->role === 'Admin';
    // }
}
