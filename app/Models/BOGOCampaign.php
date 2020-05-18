<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BOGOCampaign extends Model {
    protected $guarded = [];
    protected $table = 'bogo_campaigns';

    public function getInformation() {
        return [
            'name' => $this->name,
            'buy_type' => $this->buy_type,
            'buy_products' => $this->getBuyProducts(),
            'buy_quantity' => $this->buy_quantity,
            'customers' => $this->getCustomersData(),
            'get_type' => $this->get_type,
            'get_products' => $this->retrieveGetProducts(),
            'get_quantity' => $this->get_quantity,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'max_use_per_order' => $this->max_use_per_order,
            'min_use_per_order' => $this->min_use_per_order,
            'limit_to_one_use_per_customer' => $this->limit_to_one_use_per_customer
        ];
    }

    public function getBuyProducts() {
        if($this->buy_ids !== '*' && $this->buy_ids !== null)
            return Products::whereIn('id', explode(',', $this->buy_ids))->select(['id', 'title'])->get()->toArray();
        return null;
    }

    public function retrieveGetProducts() {
        if($this->get_ids !== '*' && $this->get_ids !== null) 
            return Products::whereIn('id', explode(',', $this->get_ids))->select(['id', 'title'])->get()->toArray();
    }

    public function getCustomersData() {
        if($this->customer_ids_eligible !== null && $this->customer_ids_eligible !== '*') 
            return Customers::whereIn('id', explode(',', $this->customer_ids_eligible))->select(['id', 'first_name', 'last_name'])->get()->toArray();
        return null;    
    }
}
