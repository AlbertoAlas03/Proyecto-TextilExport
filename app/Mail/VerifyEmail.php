<?php

namespace App\Mail;

use App\Models\Users;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $customer;

    /**
     * Create a new message instance.
     */
    public function __construct(Users $customer)
    {
        $this->customer = $customer;
    }
    public function build()
    {
        return $this->subject('Verifica tu cuenta')
            ->text('emails.verify_plain')
            ->with([
                'nombre' => $this->customer->name,
                'token' => $this->customer->token_verification,
            ]);
    }
}
