<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCampaigns extends Model {
    protected $guarded = [];

    public function getInformation() {
        return [
            'name' => $this->name,
            'countries_applicable' => $this->getCountries(),
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'buy_type' => $this->buy_type,
            'applies_to' => $this->applies_to,
            'applied_ids' => $this->getAppliedIds(),
            'min_requirements' => $this->min_requirements,
            'min_req_value' => $this->min_req_values,
            'eligible_customers' => $this->getCustomers(),
            'customer_eligibility' => $this->customer_eligibility,
            'max_no_of_uses' => $this->max_no_of_uses,
            'limit_to_one_use_per_customer' => $this->limit_to_one_use_per_customer
        ];
    }

    public function getCountries() {
        if($this->countries_applicable !== '*' && $this->countries_applicable !== null) 
            return Countries::whereIn('id', explode(',', $this->countries_applicable))->select(['id', 'name'])->get()->toArray();
        return null;    
    }

    public function getAppliedIds() {
        if($this->applied_ids !== '*' && $this->applied_ids !== null) {
            if($this->applied_ids == 'specific_collections')
                return Collections::whereIn('id', explode(',', $this->applied_ids))->select(['id', 'title'])->get()->toArray();
            if($this->applied_ids == 'specific_product')
                return Products::whereIn('id', explode(',', $this->applied_ids))->select(['id', 'title'])->get()->toArray();    
        }
        return null;
    }

    public function getCustomers() {
        if($this->customere_eligibility !== null && $this->customere_eligibilty !== '*')
            return Customers::whereIn('id', explode(',', $this->customere_eligibilty))->select(['id', 'name'])->get()->toArray();
        return null;   
    }
}
