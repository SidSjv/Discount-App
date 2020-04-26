<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignCreate;
use App\Models\BOGOCampaign;
use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller {
    public function __construct() {
        $this->middleware('authenticateAPI');
    }

    public function store(CampaignCreate $request) {
        $request = $request->all();
        $campaign_row = Campaign::updateOrCreate([
            'name' => $request['campaign_name'],
            'store_id' => $request['store_id']    
        ],[
            'name' => $request['campaign_name'],
            'store_id' => $request['store_id']    
        ]);
        if(isset($request['BOGO'])) {
            foreach($request['BOGO'] as $bogo_item) {
                $bogo_item['campaign_id'] = $campaign_row->id;
                $bogo_item['get_ids'] = json_encode($bogo_item['get_ids']);
                $bogo_item['buy_ids'] = json_encode($bogo_item['buy_ids']);
                $bogo_item['customer_ids_eligible'] = json_encode($bogo_item['customer_ids_eligible']);
                //dd($bogo_item);
                if(isset($bogo_item['id']) && $bogo_item['id'] !== null) BOGOCampaign::where('id', $bogo_item['id'])->update($bogo_item);
                else BOGOCampaign::create($bogo_item);
            }
        }
        return response()->json(['status' => true, 'message' => 'Campaign Created / Updated Successfully !'], 200);
    }
}
