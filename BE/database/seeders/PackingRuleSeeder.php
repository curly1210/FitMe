<?php

namespace Database\Seeders;

use App\Models\PackingRule;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PackingRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PackingRule::factory()->count(5)->create();
    }
}
