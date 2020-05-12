<?php

namespace App\Http\Controllers;

use App\Models\Countries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CountriesController extends Controller {
    private $pagination_count;
    public function __construct() {
        $this->middleware('auth:api');
        $this->pagination_count = config('custom.countries_pagination_count');
    }

    public function index(Request $request) {
        $countries = $this->filterCountries(Countries::where('store_id', Auth::user()->store_id), $request->all());
        return response()->json(['status' => true, 'countries' => $countries], 200);
    }

    private function filterCountries($countries, $request) {
        if(isset($request['name'])) 
            $countries = $countries->where('name', 'LIKE', '%'.$request['name'].'%');
        return $countries->select('id','name', 'code')->paginate($this->pagination_count);    
    }
}
