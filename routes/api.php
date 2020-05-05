<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('authenticateAPI')->group(function() {
    Route::get('home', 'StoreController@index');
    Route::resource('campaign', 'CampaignController');
    Route::middleware('auth:api')->group(function () {
        Route::get('test', 'CampaignController@test');
        Route::resource('customer', 'CustomerController');
        Route::get('syncStoreData/{id}', 'StoreController@syncStoreData');
    });
});
