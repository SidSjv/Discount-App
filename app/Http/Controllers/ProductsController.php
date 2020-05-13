<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductsController extends Controller {
    private $pagination_count;
    public function __construct() {
        $this->middleware('auth:api');
        $this->pagination_count = config('custom.product_pagination_count');
    }

    public function index(Request $request) {
        $products = Products::where('store_id', Auth::user()->id);
        $products = $this->filterProducts($products, $request->all());
        return response()->json(['status' => true, 'products' => $products], 200);
    }

    private function filterProducts($products, $request) {
        if(isset($request['searchTerm']) && isset($request['searchBy'])) 
            $products = $products->where($request['searchBy'], 'LIKE', '%'.$request['searchTerm'].'%');
        return $products->select(['id', 'title', 'vendor', 'handle'])->paginate($this->pagination_count);    
    }

    public function show($id) {
        return response()->json(['status' => true, 'product' => Products::where('id', $id)->first()->toArray()]);
    }
}
