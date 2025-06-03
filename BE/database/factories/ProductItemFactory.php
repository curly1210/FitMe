<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Size;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductItem>
 */
class ProductItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();
        $category = Category::find($product->category_id);
        $categoryName = $category->name;

        $size = Size::inRandomOrder()->first();
        $color = Color::inRandomOrder()->first();
        $year = now()->year;

        $sku = $this->generateSKU($categoryName, $product->id, $year, $color->id, $size->id);

        return [
            'product_id' => $product->id,
            'import_price' => fake()->numberBetween(80000, 150000),
            'price' => fake()->numberBetween(200000, 300000),
            'sale_price' => fake()->numberBetween(100000, 199999),
            'stock' => fake()->numberBetween(5, 50),
            'sku' => $sku,
            'color_id' => $color->id,
            'size_id' => $size->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function forProduct($productId)
    {
        return $this->state(function () use ($productId) {
            $product = Product::find($productId);
            $category = Category::find($product->category_id);
            $categoryName = $category->name;

            $size = Size::inRandomOrder()->first();
            $color = Color::inRandomOrder()->first();
            $year = now()->year;

            $sku = $this->generateSKU($categoryName, $productId, $year, $color->id, $size->id);

            return [
                'product_id' => $productId,
                'import_price' => fake()->numberBetween(80000, 150000),
                'price' => fake()->numberBetween(200000, 300000),
                'sale_price' => fake()->numberBetween(100000, 199999),
                'stock' => fake()->numberBetween(5, 50),
                'sku' => $sku,
                'color_id' => $color->id,
                'size_id' => $size->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });
    }

    private function generateSKU($categoryName, $productId, $year, $colorId, $sizeId)
    {
        $yearPart = substr($year, -2);
        $categoryName = Str::ascii($categoryName);
        $words = explode(' ', $categoryName);
        $categoryPart = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $categoryPart .= strtoupper($word[0]);
            }
        }

        $genderPart = Str::contains(strtolower($categoryName), 'nam') ? 'M' : 'W';
        $unique = rand(100, 999);
        return "{$yearPart}{$categoryPart}{$productId}{$genderPart}{$unique}_C{$colorId}S{$sizeId}";
    }

}
