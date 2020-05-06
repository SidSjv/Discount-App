<?php

use App\Models\DiscountTypes;
use Illuminate\Database\Seeder;

class DiscountTypesSeeder extends Seeder {
    /**
    * Run the database seeds.
    * @return void
    */
    public function run() {
        $payload = [
            'BOGO', 'Discount', 'Bulk'  
        ];
        foreach($payload as $discount_type)
            DiscountTypes::updateOrCreate(['name' => $discount_type], ['name' => $discount_type]);
    }
}
