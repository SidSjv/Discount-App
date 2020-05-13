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
        $collections = $this->filterCollections(Collections::where('store_id', Auth::user()->store_id), $request->all());
        return response()->json(
            [
                'status' => true, 
                'collections' => $collections, 
            ]
        , 200);
    }

    private function filterCollections($collections, $request) {
        if(isset($request['type']) && ($request['type'] == 'Smart' || $request['type'] == 'Custom'))
            $collections = $collections->where('type', $request['type']);
        if(isset($request['searchTerm']) && isset($request['searchBy'])) 
            $collections = $collections->where($request['searchBy'], 'LIKE', '%'.$request['searchTerm'].'%');
        return $collections->paginate($this->pagination_count);
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
