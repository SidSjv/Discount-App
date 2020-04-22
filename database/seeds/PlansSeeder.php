<?php

use App\Models\Plans;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
    */
    public function run(){
        $data = [
            [
                'name' => 'Basic', 
                'time_period' => 30, 
                'price' => 5.99, 
                'status' => 'Active',
                'no_of_orders' => 50,
                'plan_type' => 'Limited'
            ], [
                'name' => 'Standard', 
                'time_period' => 30, 
                'price' => 8.99, 
                'status' => 'Active',
                'no_of_orders' => 100,
                'plan_type' => 'Limited'
            ], [
                'name' => 'Enterprise', 
                'time_period' => 30, 
                'price' => 16.99, 
                'status' => 'Active',
                'no_of_orders' => 150,
                'plan_type' => 'Limited'
            ], [
                'name' => 'Unlimited', 
                'time_period' => 10000, 
                'price' => 199.99, 
                'status' => 'Active',
                'no_of_orders' => 99999,
                'plan_type' => 'Unlimited'
            ], [
                'name' => 'Free', 
                'time_period' => 10000, 
                'price' => 0.00, 
                'status' => 'Active',
                'no_of_orders' => 99999,
                'plan_type' => 'Unlimited'
            ]
        ];
        
        foreach($data as $row)
            Plans::create($row);
    }
}
