<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateGenderKey extends Command
{
    protected $signature = 'env:gender-key';

    protected $description = 'Tạo và thêm GENDER_KEY vào file .env nếu chưa có';

    public function handle()
    {
        $key = 'GENDER_KEY';
        $value = Str::random(32); // hoặc bạn có thể tự định nghĩa giá trị khác

        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        if (strpos($envContent, "$key=") !== false) {
            $this->info("$key đã tồn tại trong file .env");
            return;
        }

        file_put_contents($envPath, PHP_EOL . "$key=$value", FILE_APPEND);
        $this->info("Đã thêm $key vào file .env với giá trị: $value");
    }
}
