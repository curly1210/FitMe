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

class CreateRequestWithdraw extends Notification implements ShouldBroadcast
{
  use Queueable;

  public $transactionId;
  public $message;
  public $userId;
  public $isAdmin = 0;

  /**
   * Create a new notification instance.
   */
  public function __construct(int $userId, string $transactionId,  string $message, int $isAdmin = 0)

  {
    $this->userId = $userId;
    $this->transactionId = $transactionId;
    $this->message = $message;
    $this->isAdmin = $isAdmin;
    // $this->isAdmin = $isAdmin; // 1 nếu là admin, 0 nếu là user
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
      'transaction_id' => $this->transactionId,
      'message'  => $this->message,
      'icon' => '💵'
    ];
  }

  // Payload gửi realtime qua Pusher (FE sẽ nhận object notification)
  public function toBroadcast($notifiable)
  {
    return new BroadcastMessage([
      'user_id' => $this->userId,
      'transaction_id' => $this->transactionId,
      'message'  => $this->message,
      'icon' => '💵'
    ]);
  }

  public function broadcastOn()
  {
    if ($this->isAdmin === 1) {
      // kênh riêng cho admin
      return new PrivateChannel('admin.notifications');
    }
    return new PrivateChannel('App.Models.User.' . $this->userId);
    // return new PrivateChannel('admin.notifications');
  }

  public function broadcastAs()
  {
    // return 'order.updated';
    return 'order';
  }
}
