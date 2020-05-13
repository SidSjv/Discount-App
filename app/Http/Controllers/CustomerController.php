<?php

namespace App\Http\Controllers;

use App\Models\CustomerGroups;
use App\Models\Customers;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller {
    private $pagination_count;
    public function __construct() {
        $this->pagination_count = config('custom.customer_pagination_count');
        $this->middleware('auth:api'); 
    }

    public function index(Request $request) {
        $store = Store::where('id', Auth::user()->store_id)->first();
        if($request->expectsJson()) {
            if($store !== NULL && $store->count() > 0) {
                $customers = Customers::where('store_id', Auth::user()->store_id);
                $customers = $this->filterCustomers($customers, $request);
                return response()->json(['status' => true, 'customers' => $customers], 200);
            } else return response()->json(['status' => false, 'message' => 'Store Not Found !'], 200);
        }
    }

    private function filterCustomers($customers, $request) {
        if(isset($request->searchBy) && isset($request->searchTerm))
            $customers = $customers->where($request->searchBy, 'LIKE', '%'.$request->searchTerm.'%');
        return $customers->select(['id', 'first_name', 'last_name'])->paginate($this->pagination_count);    
    }

    public function show($id) {
        return response()->json(['status' => true, 'customer' => Customers::where('id', $id)->first()->toArray()], 200);
    }

    public function getCustomerGroups(Request $request) {
        $customer_groups = $this->filterCustomerGroups(CustomerGroups::where('store_id', Auth::user()->store_id), $request->all());
        return response()->json(['status' => true, 'customer_groups' => $customer_groups], 200);
    }

    private function filterCustomerGroups($customer_groups, $request) {
        if(isset($request['searchBy']) && isset($request['searchTerm']))
            $customer_groups = $customer_groups->where($request['searchBy'], 'LIKE', '%'.$request['searchTerm'].'%');
        return $customer_groups->select(['id', 'name', 'query', 'created_at', 'updated_at'])->paginate($this->pagination_count);    
    }
}
