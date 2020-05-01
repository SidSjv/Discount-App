<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\Store;
use Illuminate\Http\Request;

class CustomerController extends Controller {
    public function __construct() {
        $this->middleware('auth:api'); 
    }

    public function show($id, Request $request) {
        $store = Store::where('id', $id)->first();
        if($request->expectsJson()) {
            if($store !== NULL && $store->count() > 0) {
                $customers = Customers::where('store_id', $id)->select('id', 'name')->get()->toArray();
                return response()->json(['status' => true, 'customers' => $customers], 200);
            } else return response()->json(['status' => false, 'message' => 'Store Not Found !'], 200);
        }
    }
}
