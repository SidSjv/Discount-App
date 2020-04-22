<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignCreate;
use Illuminate\Http\Request;

class CampaignController extends Controller {
    public function __construct() {

    }

    public function store(CampaignCreate $request) {
        if($request->wantsJson()) { //API call
            
        }  
    }
}
