<?php

namespace App\Http\Controllers;

use App\Jobs\Sync\Collections;
use App\Jobs\Sync\Customers;
use App\Jobs\Sync\Products;
use App\Models\Store;
use App\User;
use Exception;
use Illuminate\Http\Request;

class StoreController extends Controller {
    public function __construct() {
        
    }

    public function index($id, Request $request) {
        if($request->expectsJson()) {
            $store_details = Store::where('id', $id)->first();
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
}
