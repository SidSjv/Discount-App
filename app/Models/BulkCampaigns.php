<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkCampaigns extends Model {
    protected $guarded = [];

    public function getInformation() {
        return [
            'name' => $this->name,
            'discount_levels' => json_decode($this->discount_levels, true),
            'buy_type' => $this->buy_type,
            'quantity' => $this->quantity,
            'eligible_customers' => $this->getCustomers(),
            'max_uses_per_order' => $this->max_uses_per_order,
            'max_no_of_uses' => $this->max_no_of_uses,
            'min_use_per_order' => $this->min_use_per_order,
            'limit_to_one_use_per_customer' => $this->limit_to_one_use_per_customer
        ];
    }

    public function getCustomers() {
        if($this->eligible_customers !== '*' && $this->eligible_customers !== null)
            return Customers::whereIn('id', explode(',', $this->eligible_customers))->get()->toArray();
        return null;    
    }
}
