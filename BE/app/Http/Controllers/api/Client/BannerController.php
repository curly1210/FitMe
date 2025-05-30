<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Http\Resources\Client\BannerResource;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::latest()->get();

        return BannerResource::collection($banners);
    }
}
