<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryResource extends ResourceCollection
{
    use CloudinaryTrait;

    protected $childCategories;

    public function __construct($resource, $childCategories)
    {
        // Gọi constructor của parent để gán $resource vào $this->collection
        parent::__construct($resource);
        $this->childCategories = $childCategories;
    }

    public function toArray(Request $request)
    {
        // Kiểm tra nếu collection rỗng, trả về mảng rỗng
        if ($this->collection->isEmpty()) {
            return [];
        }

        return $this->collection->map(function ($parent) {
            $children = $this->childCategories->where('parent_id', $parent->id)->values();

            return [
                'id' => $parent->id,
                'name' => $parent->name,
                'parent_id' => $parent->parent_id,
                'is_active' => $parent->is_active,
                'image' => $this->buildImageUrl($parent->image),
                'children' => $children->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'image' => $this->buildImageUrl($item->image),
                    ];
                })->toArray(),
            ];
        })->toArray();
    }
}