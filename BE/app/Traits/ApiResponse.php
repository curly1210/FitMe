<?php


namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, $message = 'Thành công')
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ]);
    }

    protected function error($message = 'Lỗi hệ thống', $errors = [], $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ], $code);
    }
}
