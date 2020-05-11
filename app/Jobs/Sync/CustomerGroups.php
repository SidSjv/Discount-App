<?php

namespace App\Jobs\Sync;

use App\Models\Store;
use App\Models\CustomerGroups as StoreCustomerGroups;
use App\Traits\RequestTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CustomerGroups implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, RequestTrait;
    private $store_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($store_id) {
        $this->store_id = $store_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $store = Store::where('id', $this->store_id)->first();
        if($store != null && $store->count() > 0) {
            $since_id = 0;
            do {
                $endpoint = getShopifyURLForStore('customer_saved_searches.json?since_id='.$since_id, null, $store->permanent_domain);
                $response = json_decode($this->makeAGETCallToShopify($endpoint, [], getShopifyHeadersForStore($store->access_token, 'GET')), true);
                if($response !== NULL && isset($response['customer_saved_searches']) && count($response['customer_saved_searches']) > 0) {
                    foreach($response['customer_saved_searches'] as $row) {
                        $payload = ['store_id' => $this->store_id];
                        foreach($row as $key => $value)
                            $payload[$key] = is_array($value) ? json_encode($value) : $value; 
                        StoreCustomerGroups::updateOrCreate(['id' => $row['id']], $payload);
                        $since_id = $row['id'];
                    }
                } else break;
            } while($response !== NULL || count($response) > 0);
        }
    }
}
