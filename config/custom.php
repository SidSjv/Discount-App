<?php 
    return [
        //Shopify API version to be followed throughout the application
        'shopify_rest_api_version' => '2020-04',
        'shopify_api_key' => env('API_KEY', 'd2b25268b470244c46b12ab66abff281'),
        'shopify_api_secret' => env('API_SECRET', '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'),
        'app_name' => env('SHOPIFY_APP_NAME', 'discount-app-staging'),
        'client_id' => env('CLIENTID', '4'),
        'client_secret' => env('CLIENTSECRET', '4N0Vsl2IKOgPlYLNWAnerBB88XWXB7bhiC0eSGnV'),
        'default_pagination_count' => 25,
        'product_pagination_count' => 25,
        'customer_pagination_count' => 25,
        'collection_pagination_count' => 25
    ];
?>