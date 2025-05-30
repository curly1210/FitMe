<?php

namespace App\Http\Resources\Admin;

use Cloudinary\Cloudinary;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryResource extends ResourceCollection
{
    use CloudinaryTrait;
    protected $childCategories;

    public function __construct($resource, $childCategories)
    {
        parent::__construct($resource);
        $this->childCategories = $childCategories;
    }

    public function toArray(Request $request)
    {

        return $this->collection->map(function ($parent) {
            $children = $this->childCategories->where('parent_id', $parent->id)->values();

            return [
                'id' => $parent->id,
                'name' => $parent->name,
                'slug' => Str::slug($parent->name),
                'parent_id' => $parent->parent_id,
                'is_active' => $parent->is_active,
                'created_at' => $parent->created_at == null ? $parent->created_at : $parent->created_at->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
                'updated_at' => $parent->updated_at == null ? $parent->updated_at : $parent->updated_at->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
                'deleted_at' => $parent->deleted_at == null ? $parent->deleted_at : $parent->deleted_at->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
                'items' => $children->map(function ($item) {

                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => Str::slug($item->name),
                        'image' => $this->buildImageUrl($item->image),
                    ];
                }),
            ];
        });
    }
}
