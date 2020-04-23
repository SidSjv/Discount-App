<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\Products;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhooksController extends Controller {
    public function deleteProduct(Request $request) {
        try{
            Log::info(['Product deletion headers' => $request->headers->all()]);
            Log::info(['Product deletion body' => $request->all()]);
            $store_details = Store::where('permanent_domain', $request->headers->all()['x-shopify-shop-domain'][0])->first();
            if($store_details != NULL && $store_details->count() > 0) {
                DB::beginTransaction();
                Products::where('id', $request->all()['id'])->delete();
                DB::commit();
                Log::info(['Product deleted : ' => $request->all()['id']]);
            } else throw new Exception('Store Details row not found for product creation for store - '.json_encode($request->headers->all()['x-shopify-shop-domain']), 400);   
        } catch (Exception $e) { Log::info(['code' => $e->getCode(), 'New product webhook message' => $e->getMessage()]); }
        return response()->json(['status' => 'success'], 200);
    }

    public function deleteCustomer(Request $request) {
        try{
            Log::info(['Customer deletion headers' => $request->headers->all()]);
            Log::info(['Customer deletion body' => $request->all()]);
            $store_details = Store::where('permanent_domain', $request->headers->all()['x-shopify-shop-domain'][0])->first();
            if($store_details != NULL && $store_details->count() > 0) {
                DB::beginTransaction();
                Customers::where('id', $request->all()['id'])->delete();
                DB::commit();
                Log::info(['Customer deleted : ' => $request->all()['id']]);
            } else throw new Exception('Store Details row not found for Customer creation for store - '.json_encode($request->headers->all()['x-shopify-shop-domain']), 400);   
        } catch (Exception $e) { Log::info(['code' => $e->getCode(), 'New Customer webhook message' => $e->getMessage()]); }
        return response()->json(['status' => 'success'], 200);
    }

    public function storeProduct(Request $request){
        try{
            DB::beginTransaction();
            Log::info(['Product creation headers' => $request->headers->all()]);
            Log::info(['Product creation body' => $request->all()]);
            $payload = [];
            foreach($request->all() as $key => $value)
                $payload[$key] = is_array($value) ? json_encode($value) : $value;
            $store_details = Store::where('permanent_domain', $request->headers->all()['x-shopify-shop-domain'][0])->first();
            if($store_details != NULL && $store_details->count() > 0) {
                $payload['store_id'] = $store_details->id; 
                Products::updateOrCreate(['id' => $request->all()['id']], $payload);
                DB::commit();
                Log::info(['New Product created/updated : ' => $request->all()['id']]);
            } else throw new Exception('Store Details row not found for product creation for store - '.json_encode($request->headers->all()['x-shopify-shop-domain']), 400);   
        } catch (Exception $e) { Log::info(['code' => $e->getCode(), 'New product webhook message' => $e->getMessage()]); }
        return response()->json(['status' => 'success'], 200);
    }

    public function storeCustomer(Request $request){
        try{
            DB::beginTransaction();
            Log::info(['Customer creation headers' => $request->headers->all()]);
            Log::info(['Customer creation body' => $request->all()]);
            $payload = [];
            foreach($request->all() as $key => $value)
                $payload[$key] = is_array($value) ? json_encode($value) : $value;
            $store_details = Store::where('permanent_domain', $request->headers->all()['x-shopify-shop-domain'][0])->first();
            if($store_details != NULL && $store_details->count() > 0) {
                $payload['store_id'] = $store_details->id; 
                Customers::updateOrCreate(['id' => $request->all()['id']], $payload);
                DB::commit();
                Log::info(['New Customer created/updated : ' => $request->all()['id']]);
            } else throw new Exception('Store Details row not found for Customer creation for store - '.json_encode($request->headers->all()['x-shopify-shop-domain']), 400);   
        } catch (Exception $e) { Log::info(['code' => $e->getCode(), 'New Customer webhook message' => $e->getMessage()]); }
        return response()->json(['status' => 'success'], 200);
    }

    public function storeCollection(Request $request){
        try{
            DB::beginTransaction();
            Log::info(['Collection creation headers' => $request->headers->all()]);
            Log::info(['Collection creation body' => $request->all()]);
            //$payload = [];
            // foreach($request->all() as $key => $value)
            //     $payload[$key] = is_array($value) ? json_encode($value) : $value;
            // $store_details = Store::where('permanent_domain', $request->headers->all()['x-shopify-shop-domain'][0])->first();
            // if($store_details != NULL && $store_details->count() > 0) {
            //     $payload['store_id'] = $store_details->id; 
            //     //Collections::updateOrCreate(['id' => $request->all()['id']], $payload);
            //     DB::commit();
            //     Log::info(['New Collection created : ' => $request->all()['id']]);
            // } else throw new Exception('Store Details row not found for Collection creation for store - '.json_encode($request->headers->all()['x-shopify-shop-domain']), 400);   
        } catch (Exception $e) { Log::info(['code' => $e->getCode(), 'New Collection webhook message' => $e->getMessage()]); }
        return response()->json(['status' => 'success'], 200);
    }
}
