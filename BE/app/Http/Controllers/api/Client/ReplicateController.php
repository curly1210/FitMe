<?php

// namespace App\Http\Controllers;
namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Traits\CloudinaryTrait;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReplicateController extends Controller
{
  use CloudinaryTrait;

  public function run(Request $request)
  {

    if (!$request->hasFile('human_img')) {
      return response()->json(['error' => 'Missing human_img file'], 400);
    }

    $uploadResult = $this->uploadImageToCloudinary($request->file('human_img'), [
      'quality' => 80,
      'folder' => 'try_on_clothes',
    ]);

    $url_human_img = $uploadResult['url'];

    // return response()->json([$uploadResult, $url_human_img]);

    $input = [
      'crop'         => filter_var($request->input('crop'), FILTER_VALIDATE_BOOLEAN),
      'seed'         => intval($request->input('seed')),
      'steps'        => intval($request->input('steps')),
      'category'     => $request->input('category'),
      'force_dc'     => filter_var($request->input('force_dc'), FILTER_VALIDATE_BOOLEAN),
      'garm_img'     => $request->input('garm_img'),
      'human_img'    => $url_human_img, // dùng URL ảnh vừa upload
      'mask_only'    => filter_var($request->input('mask_only'), FILTER_VALIDATE_BOOLEAN),
      'garment_des'  => $request->input('garment_des'),
    ];

    $response = Http::withHeaders([
      'Authorization' => 'Token ' . env('REPLICATE_API_TOKEN'),
      'Content-Type' => 'application/json',
    ])->post('https://api.replicate.com/v1/predictions', [
      'version' => $request->version, // nên truyền từ FE
      'input' => $input, // chứa các tham số cho model
    ]);

    return response()->json($response->json(), $response->status());
  }

  public function status($id)
  {
    $response = Http::withHeaders([
      'Authorization' => 'Token ' . env('REPLICATE_API_TOKEN'),
    ])->get("https://api.replicate.com/v1/predictions/{$id}");

    return response()->json($response->json(), $response->status());
  }
}
