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

<<<<<<< HEAD
  public function index(Request $request) {
=======
    public function index(Request $request) {
>>>>>>> ad36dad673c000ff33c98e5651a8542f6a01f8c8
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
}
