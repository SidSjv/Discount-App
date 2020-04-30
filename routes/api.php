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
    Route::resource('campaign', 'CampaignController');
    Route::get('home/{id}', 'StoreController@index')->name('home');
    Route::get('syncStoreData/{id}', 'StoreController@syncStoreData');
    Route::middleware('auth:api')->group(function () {
        Route::get('test', 'CampaignController@test');
    });
});
