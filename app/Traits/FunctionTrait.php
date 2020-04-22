<?php 

namespace App\Traits;

use App\Models\Store;
use App\Models\StoreInstallations;
use App\Plans;

trait FunctionTrait{ 
    public function getStoreDetailsByDomain($domain){
        return Store::where('permanent_domain', $domain)->first();
    }

    public function getPlanDetailsById($id){
        return Plans::where('id', $id)->first();
    }    

    public function insertStoreInstallationData($store_id){
        StoreInstallations::create(['store_id' => $store_id]);
        return true;
    }
}