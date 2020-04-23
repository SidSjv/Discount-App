<?php

namespace App\Jobs\Sync;

use App\Models\Store;
use App\Traits\RequestTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
        do {
            $endpoint = getShopifyURLForStore('collections.json?since_id='.$since_id, null, $store_details->permanent_domain);
            $response = $this->makeAGETCallToShopify($endpoint, [], getShopifyHeadersForStore($store_details->access_token, 'GET'));
            if($response !== NULL) {
                $response = json_decode($response, true);
            }
        } while(true);
    }
}
