<?php

use Illuminate\Support\Facades\Route;

//Store Installation Routes
Route::get('/', 'ShopifyController@welcome');
Route::get('/shopify', 'ShopifyController@onBoard');
Route::get('/shopify/callback', 'ShopifyController@callBack');
Route::get('/shopify/activate', 'ShopifyController@activate');

//welcome route
Route::get('home', 'HomeController@index');
Route::get('campaign', 'HomeController@index');
Route::get('campaign/bogo/', 'HomeController@index');
Route::get('campaign/bogo/{id}', 'HomeController@index');
Route::get('campaign/discount/{id}', 'HomeController@index');
Route::get('campaign/bulk/{id}', 'HomeController@index');
Route::get('settings', 'HomeController@index');

//Webhooks Routes
Route::post('newCollection', 'WebhooksController@storeCollection');
Route::post('updateCollection', 'WebhooksController@storeCollection');
Route::post('newProduct', 'WebhooksController@storeProduct');
Route::post('updateProduct', 'WebhooksController@storeProduct');
Route::post('newCustomer', 'WebhooksController@storeCustomer');
Route::post('updateCustomer', 'WebhooksController@storeCustomer');
Route::post('deleteProduct', 'WebhooksController@deleteProduct');
Route::post('deleteCustomer', 'WebhooksController@deleteCustomer');
Route::post('deleteCollection', 'WebhooksController@deleteCollection');