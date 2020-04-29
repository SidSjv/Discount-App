<?php

namespace App\Http\Controllers;

use App\Jobs\Sync\Collections;
use App\Jobs\Sync\Customers;
use App\Jobs\Sync\Products;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class StoreController extends Controller {
    public function __construct() {
        
    }

    public function index($id, Request $request) {
        echo '<pre>';
        print_r($request->headers->all());
        print_r($request->all());
    }

    public function syncStoreData($id){
        try{
        //Products::dispatchNow($id);
        //Customers::dispatchNow($id);
        Collections::dispatch($id);
        return response()->json(['status' => true, 'message' => 'Submitted !'], 200);
        } catch(Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 200);
        }
    }
}
