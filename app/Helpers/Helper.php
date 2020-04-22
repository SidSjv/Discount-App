<?php

if (!function_exists('DummyFunction')) {

    /**
     * description
     *
     * @param
     * @return
     */
    function DummyFunction()
    {

    }
}

if(!function_exists('getShopifyURLForStore')) {
    function getShopifyURLForStore($url, $version = NULL, $domain = null) {
        if($version === NULL) $version = config('app.shopify_rest_api_version');
        return 'https://'.$domain.'/admin/api/'.$version.'/'.$url;
    }
}

