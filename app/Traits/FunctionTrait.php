<?php 

namespace App\Traits;

use App\Models\Store;
use App\Models\StoreInstallations;
use App\Models\Plans;
use Illuminate\Support\Facades\Log;

trait FunctionTrait{ 
    public function getStoreDetailsByDomain($domain){
        return Store::where('permanent_domain', $domain)->first();
    }

    public function registerForWebhooks($payload, $events) {
        $endpoint = getShopifyURLForStore('webhooks.json', null, $payload["permanent_domain"]);
        Log::info('Endpoint for webhook - '.$endpoint);
        $headers = ['Content-Type:application/json', 'X-Shopify-Access-Token:'.$payload['access_token']];    
        foreach($events as $event => $route) {
            $shopify_payload = json_encode(["webhook" => ["topic" => $event, "address" => $this->forwardingAddress.$route, "format" => "json"]]);
            $response = $this->makeAPOSTCallToShopify($shopify_payload, $endpoint, $headers);
            Log::info(['message' => 'Registered For Webhook - '.$event, 'response' => $response]);
        }
        return true;
    }

    public function getPlanDetailsById($id){
        return Plans::where('id', $id)->first();
    }    

    public function insertStoreInstallationData($store_id){
        StoreInstallations::create(['store_id' => $store_id]);
        return true;
    }
}