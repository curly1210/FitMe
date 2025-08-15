<?php

namespace App\Traits;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Cloudinary;
use Intervention\Image\Laravel\Facades\Image;

trait CloudinaryTrait
{
    # Hàm lấy ra link ảnh thông qua public_id lưu trong trường image ở các bảng
    protected function buildImageUrl($image)
    {
        if (!$image) {
            return null;
        }
        // Nếu là URL thật thì trả về luôn
        if (filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }
        // Nếu là public_id thì build link Cloudinary
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        return "https://res.cloudinary.com/{$cloudName}/image/upload/{$image}";
    }

    protected function buildVideoUrl($video)
    {
        if (!$video) {
            return null;
        }
        // Nếu là URL thật thì trả về luôn
        if (filter_var($video, FILTER_VALIDATE_URL)) {
            return $video;
        }
        // Nếu là public_id thì build link Cloudinary
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        return "https://res.cloudinary.com/{$cloudName}/video/upload/{$video}";
    }
    # hàm upload ảnh lên Cloudinary
    /**
     * @param array $options [
     *      'width' => int|null,
     *      'height' => int|null,
     *      'quality' => int (0-100),
     *      'folder' => string
     * ]
     * */
    protected function uploadImageToCloudinary($file, $options = [])
    {
        $width = $options['width'] ?? null;
        $height = $options['height'] ?? null;
        $quality = $options['quality'] ?? 80;
        $folder = $options['folder'] ?? 'uploads';

        // Đọc ảnh và resize nếu có width hoặc height
        $image = Image::read($file);
        if ($width || $height) {
            $image->resize($width, $height);
            $image->scale(width: 300);
            $image->scaleDown(width: 300, height: 200);
        }

        // Encode ảnh sang webp với chất lượng mong muốn
        $tmpPath = sys_get_temp_dir() . '/' . uniqid() . '.webp';
        $image->toWebp($quality)->save($tmpPath);

        // Upload lên Cloudinary
        $cloudinary = new Cloudinary();
        $result = $cloudinary->uploadApi()->upload($tmpPath, ['folder' => $folder]);

        // Xóa file tạm
        @unlink($tmpPath);

        return $result;
    }
    # hàm xóa ảnh ở trên Cloudinary (sử dụng khi update hoặc delete ảnh)
    protected function deleteImageFromCloudinary($publicId)
    {
        if (!$publicId) {
            return false;
        }
        try {
            $cloudinary = new Cloudinary();
            $cloudinary->uploadApi()->destroy($publicId);
            return true;
        } catch (\Exception $e) {
            // Log lỗi nếu cần
            return false;
        }
    }

    protected function deleteFolderFromCloudinary($folderPath)
    {
        if (!$folderPath) {
            return false;
        }

        try {
            $cloudinary = new Cloudinary();
            $cloudinary->adminApi()->deleteFolder($folderPath);
            return true;
        } catch (\Exception $e) {
            // Ghi log nếu cần: Log::error('Xóa folder thất bại: ' . $e->getMessage());
            return false;
        }
    }
    public function uploadVideoToCloudinary($file, $folder)
    {
        try {
            $cloudinary = new UploadApi();
            $filePath = $file->getRealPath();
            $data = $cloudinary->upload($filePath, [
                'folder' => $folder,
                'resource_type' => 'video',
                'chunk_size' => 6000000,
                'eager' => [
                    ['width' => 300, 'height' => 300, 'crop' => 'pad'],
                    ['width' => 160, 'height' => 100, 'crop' => 'crop', 'gravity' => 'south']
                ],
                'eager_async' => true,
            ]);
            return $data;
        } catch (\Throwable $th) {
            return $this->error("Tải video thất bại", $th->getMessage(), 400);
        }
    }
}
