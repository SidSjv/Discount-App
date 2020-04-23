<?php

namespace App\Jobs\Sync;

use App\Models\Products as ProductsModel;
use App\Models\Store;
use App\Traits\RequestTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class Products implements ShouldQueue {
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
        $store_details = Store::where('id', $this->store_id)->first();
        if($store_details !== NULL && $store_details->count() > 0)
        do {
            $endpoint = getShopifyURLForStore('products.json?since_id='.$since_id, null, $store_details->permanent_domain);
            Log::info('Endpoint for products json '.$endpoint);
            $response = json_decode($this->makeAGETCallToShopify($endpoint, [], getShopifyHeadersForStore($store_details->access_token, 'GET')), true);
            if($response !== NULL && isset($response['products']) && count($response['products']) > 0) {
                foreach($response['products'] as $row) {
                    $payload = ['store_id' => $this->store_id];
                    foreach($row as $key => $value)
                        $payload[$key] = is_array($value) ? json_encode($value) : $value; 
                    ProductsModel::updateOrCreate(['id' => $row['id']], $payload);
                    $since_id = $row['id'];
                }
            } else break;
        } while($response !== NULL || count($response) > 0);
    }
}
