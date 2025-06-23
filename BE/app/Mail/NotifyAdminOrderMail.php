<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotifyAdminOrderMail extends Mailable
{
    use Queueable, SerializesModels;
    public $order;
    public $orderDetails;

    /**
     * Create a new message instance.
     */
    public function __construct($order, $orderDetails)
    {
        //
        $this->order = $order;
        $this->orderDetails = $orderDetails;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notify Admin Order Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notify_admin_order',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
      public function build()
    {
       return $this->subject('Đơn hàng mới từ khách hàng')
                    ->view('emails.notify_admin_order')
                    ->with([
                        'order' => $this->order,
                        'orderDetails' => $this->orderDetails,
                    ]);
    }
}
