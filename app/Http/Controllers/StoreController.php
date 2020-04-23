<?php

namespace App\Http\Controllers;

use App\Jobs\Sync\Collections;
use App\Jobs\Sync\Customers;
use App\Jobs\Sync\Products;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller {
    public function __construct() {
        
    }

    public function index(Request $request) {
        print_r($request->all());
    }

    public function syncStoreData($id){
        Products::dispatch($id);
        Customers::dispatch($id);
        Collections::dispatch($id);
        $store_details = Store::where('id', $id)->first();
        $url = getShopifyURLForStore('webhooks.json', null, $store_details->permanent_domain);
        return response()->json(['status' => true, 'message' => 'Submitted !', 'url' => $url], 200);
    }
}
