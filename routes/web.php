<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });
//Route::get('/', 'HomeController@home')->name('home');
//Store Installation Routes
Route::get('/', 'ShopifyController@welcome');
Route::get('/shopify', 'ShopifyController@onBoard');
Route::get('/shopify/callback', 'ShopifyController@callBack');
Route::get('/shopify/activate', 'ShopifyController@activate');