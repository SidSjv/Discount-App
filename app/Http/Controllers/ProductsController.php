<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductsController extends Controller {
    public function __construct() {
        $this->middleware('auth:api');
    }

    public function index(Request $request) {
        return response()->json(['status' => true, 'products' => Products::where('store_id', Auth::user()->id)->get()]);
    }

    public function show($id) {
        return response()->json(['status' => true, 'product' => Products::where('id', $id)->first()->toArray()]);
    }
}
