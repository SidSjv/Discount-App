<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignCreate;
use App\Models\BOGOCampaign;
use App\Models\BulkCampaigns;
use App\Models\Campaign;
use App\Models\DiscountCampaigns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CampaignController extends Controller {
    public function __construct() {
        $this->middleware('auth:api');
    }

    public function show($id, Request $request) {
        if(isset($id) && $id !== null) {
            $campaigns = Campaign::where('store_id', $id)->get();
            if($campaigns !== null && $campaigns->count() > 0) {
                $payload = [];
                foreach($campaigns as $campaign) {
                    $temp = ['campaign_id' => $campaign->id, 'name' => $campaign->name];
                    $temp['bogo'] = BOGOCampaign::where('campaign_id', $campaign->id)->get()->pluck('name');
                    $temp['discount'] = DiscountCampaigns::where('campaign_id', $campaign->id)->get()->pluck('name');
                    $temp['bulk'] = BulkCampaigns::where('campaign_id', $campaign->id)->get()->pluck('name');
                    $payload[] = $temp;
                }
                return response()->json(['status' => true, 'campaigns' => $payload], 200);
            } else return response()->json(['status' => true, 'campaigns' => null], 200);
        } 
        return response()->json(['status' => false, 'message' => 'Invalid / Missing store_id in request headers !'], 200);
    }

    public function store(CampaignCreate $request) {
        $request = $request->all();
        $campaign_row = Campaign::updateOrCreate([
            'name' => $request['campaign_name'],
            'store_id' => Auth::user()->store_id    
        ],[
            'name' => $request['campaign_name'],
            'store_id' => Auth::user()->store_id    
        ]);
        if(isset($request['BOGO'])) {
            foreach($request['BOGO'] as $bogo_item) {
                $bogo_item['campaign_id'] = $campaign_row->id;
                $bogo_item['get_ids'] = json_encode($bogo_item['get_ids']);
                $bogo_item['buy_ids'] = json_encode($bogo_item['buy_ids']);
                $bogo_item['customer_ids_eligible'] = json_encode($bogo_item['customer_ids_eligible']);
                if(isset($bogo_item['id']) && $bogo_item['id'] !== null) BOGOCampaign::where('id', $bogo_item['id'])->update($bogo_item);
                else BOGOCampaign::create($bogo_item);
            }
        }
        return response()->json(['status' => true, 'message' => 'Campaign Created / Updated Successfully !'], 200);
    }
}
