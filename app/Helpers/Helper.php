<?php

if(!function_exists('getShopifyURLForStore')) {
    function getShopifyURLForStore($url, $version = NULL, $domain = null) {
        if($version === NULL) $version = config('custom.shopify_rest_api_version');
        return 'https://'.$domain.'/admin/api/'.$version.'/'.$url;
    }
}

if(!function_exists('getShopifyHeadersForStore')) {
    function getShopifyHeadersForStore($token, $method) {
        switch($method) {
            case 'GET' : return ['Content-Type' => 'application/json', 'X-Shopify-Access-Token' => $token];
            case 'POST' : return ['Content-Type: application/json', 'X-Shopify-Access-Token: '.$token];
        }
    }
}