<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model {
    protected $guarded = [];

    public function getInformation() {
        return [
            'name' => $this->name, 
            'status' => $this->status, 
            'start_date' => $this->start_date, 
            'end_date' => $this->end_date,
            'discount_type' => $this->discount_type,
            'times_used' => $this->times_used,
            'created_at' => date('Y-m-d h:i:s', strtotime($this->created_at)),
            'favourite' => $this->favorite,
            'BOGO' => $this->getBOGODetails($this->id),
            'Discount' => $this->getDiscountDetails($this->id),
            'Bulk' => $this->getBulkDetails($this->id)
        ];
    }

    private function getBOGODetails($id) {
        $bogo_data = BOGOCampaign::where('campaign_id', $id)->get();
        $bogo_payload = [];
        if($bogo_data !== null && $bogo_data->count() > 0)
            foreach($bogo_data as $bogo_item)
                $bogo_payload[] = $bogo_item->getInformation();
        return $bogo_payload;
    }

    private function getBulkDetails($id) {
        $bulk_data = BulkCampaigns::where('campaign_id', $id)->get();
        $bulk_payload = [];
        if($bulk_data !== null && $bulk_data->count() > 0)
            foreach($bulk_data as $bulk_item)
                $bulk_payload[] = $bulk_item->getInformation();
        return $bulk_payload;            
    }

    private function getDiscountDetails($id) {
        $discount_data = DiscountCampaigns::where('campaign_id', $id)->get();
        $discount_payload = [];
        if($discount_data !== null && $discount_data->count() > 0)
            foreach($discount_data as $discount_item) 
                $discount_payload[] = $discount_item->getInformation();
        return $discount_payload;
    }
}
