<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignCreate;
use App\Models\BOGOCampaign;
use App\Models\BulkCampaigns;
use App\Models\Campaign;
use App\Models\DiscountCampaigns;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CampaignController extends Controller {
    public function __construct() {
       // $this->middleware('auth:api');
    }

    public function index(Request $request) {
        $id = Auth::user()->store_id;
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
        try{
        $request = $request->all();
        DB::beginTransaction();
        $exists = Campaign::where('name', $request['campaign_name'])->where('store_id', Auth::user()->store_id)->exists();
        $message = $exists ? 'Updated' : 'Created';
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
        if(isset($request['Discount'])) {
            foreach($request['Discount'] as $discount_item) {
                $discount_item['campaign_id'] = $campaign_row->id;
                $discount_item['eligible_customers'] = json_encode($discount_item['eligible_customers']);
                if(isset($discount_item['id']) && $discount_item['id'] !== null) DiscountCampaigns::where('id', $discount_item['id'])->update($discount_item);
                else DiscountCampaigns::create($discount_item);
            }
        }
        if(isset($request['Bulk'])) {
            foreach($request['Bulk'] as $bulk_item) {
                $bulk_item['campaign_id'] = $campaign_row->id;
                $bulk_item['eligible_customers'] = json_encode($bulk_item['eligible_customers']);
                if(isset($bulk_item['id']) && $bulk_item['id'] !== null) BulkCampaigns::where('id', $bulk_item['id'])->update($bulk_item);
                else BulkCampaigns::create($bulk_item);
            }
        }
        DB::commit();
        return response()->json(['status' => true, 'message' => 'Campaign '.$message.' Successfully !'], 200);
        } catch(Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 501);
        }
    }
}
