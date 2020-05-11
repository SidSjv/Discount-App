<?php

namespace App\Jobs\Sync;

use App\Models\Collections as StoreCollections;
use App\Models\Store;
use App\Traits\RequestTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class Collections implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, RequestTrait;
    private $store_id;
    /**
    * Create a new job instance.
    * @return void
    */
    public function __construct($store_id) {
        $this->store_id = $store_id;
    }

    /**
    * Execute the job.
    * @return void
    */
    public function handle() {
        $since_id = 0;
        $store_details = Store::find($this->store_id)->first();
        if($store_details !== NULL && $store_details->count() > 0) {
            $this->syncSmartCollections($store_details);
            $this->syncCustomCollections($store_details);
        }
    }

    private function syncSmartCollections($store_details) {
        $since_id = 0;
        do {
            $endpoint = getShopifyURLForStore('smart_collections.json?since_id='.$since_id, null, $store_details->permanent_domain);
            Log::info('Endpoint for smart_collections json '.$endpoint);
            $response = json_decode($this->makeAGETCallToShopify($endpoint, [], getShopifyHeadersForStore($store_details->access_token, 'GET')), true);
            if($response !== NULL && isset($response['smart_collections']) && count($response['smart_collections']) > 0) {
                foreach($response['smart_collections'] as $row) {
                    $payload = ['store_id' => $this->store_id, 'type' => 'Smart'];
                    foreach($row as $key => $value)
                        $payload[$key] = is_array($value) ? json_encode($value) : $value; 
                    StoreCollections::updateOrCreate(['id' => $row['id']], $payload);
                    $since_id = $row['id'];
                }
            } else break;
        } while($response !== NULL || count($response) > 0);
    }

    private function syncCustomCollections($store_details) {
        $since_id = 0;
        do {
            $endpoint = getShopifyURLForStore('custom_collections.json?since_id='.$since_id, null, $store_details->permanent_domain);
            Log::info('Endpoint for custom_collections json '.$endpoint);
            $response = json_decode($this->makeAGETCallToShopify($endpoint, [], getShopifyHeadersForStore($store_details->access_token, 'GET')), true);
            if($response !== NULL && isset($response['custom_collections']) && count($response['custom_collections']) > 0) {
                foreach($response['custom_collections'] as $row) {
                    $payload = ['store_id' => $this->store_id, 'type' => 'Custom'];
                    foreach($row as $key => $value)
                        $payload[$key] = is_array($value) ? json_encode($value) : $value; 
                    StoreCollections::updateOrCreate(['id' => $row['id']], $payload);
                    $since_id = $row['id'];
                }
            } else break;
        } while($response !== NULL || count($response) > 0);
    }
}
