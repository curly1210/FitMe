<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use ReCaptcha\ReCaptcha;

class Captcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        
        $recaptcha = new ReCaptcha(config('services.recaptcha.secret'));
        $response = $recaptcha->verify($value, request()->ip());

        if (!$response->isSuccess()) {
            $fail('Vui lòng xác nhận bạn không phải bot.');
        }
    }

    // public function passes($attribute, $value)
    // {
    //     $recaptcha = new ReCaptcha(env('CAPTCHA_SECRET'));
    //     $response = $recaptcha->verify($value, $_SERVER['REMOTE_ADDR']);
    //     return $response->isSuccess();
    // }

    // public function message()
    // {
    //     return  'Vui lòng xác nhận bạn không phải là bot.'; //trả về thông báo khi lỗi không xác nhận captcha
    // }
}
