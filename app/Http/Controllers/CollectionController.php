<?php

namespace App\Http\Controllers;

use App\Models\Collections;
use App\Models\CustomCollections;
use App\Models\SmartCollections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller {
    public function __construct() {
        $this->middleware('auth:api');
        $this->pagination_count = config('custom.collection_pagination_count');
    }

    public function index(Request $request) {
        
        return response()->json(
            [
                'status' => true, 
                'collections' => Collections::where('store_id', Auth::user()->store_id)->paginate($this->pagination_count), 
            ]
        , 200);
    }

    public function show($id) {
        return response()->json(
            [
                'status' => true, 
                'smart_collections' => Collections::where('id', $id)->first()->toArray(),
            ]
        , 200);
    }
}
