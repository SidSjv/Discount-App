<?php

namespace App\Http\Controllers;

use App\Jobs\Sync\Collections;
use App\Jobs\Sync\Customers;
use App\Jobs\Sync\Products;
use App\Models\DiscountTypes;
use App\Models\Store;
use App\User;
use Exception;
use Illuminate\Http\Request;

class StoreController extends Controller {
    public function __construct() {
        
    }

    public function index(Request $request) {
        if($request->expectsJson()) {
            $store_details = Store::where('id', $request->store_id)->first();
            if($store_details !== null && $store_details->count() > 0)
                return ['token' => $store_details->getUserDetails->access_token];
        }
    }

    public function syncStoreData($id){
        try{
            Products::dispatchNow($id);
            Customers::dispatchNow($id);
            Collections::dispatch($id);
            return response()->json(['status' => true, 'message' => 'Completed !'], 200);
        } catch(Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 200);
        }
    }

    public function discount_types() {
        $discount_types = DiscountTypes::select('id', 'name', 'description')->get()->toArray();
        if($discount_types !== null && count($discount_types) > 0){
            $i = 0;
            foreach($discount_types as $type){
                $discount_types[$i]['description'] = json_decode($discount_types[$i]['description'], true);
                $i++;
            }
        }
        return ['status' => true, 'discounts' => $discount_types];
    }
}
