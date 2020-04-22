<?php 

namespace App\Traits;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

trait RequestTrait{
    /**
     * Calls the Shopify URL via POST method.
     * @param json_encoded Data, a URL (Shopify) and array of headers
     * @return an array([
     *                      'httpCode' => HTTP CODE, 
     *                      'result' => result of curl operation, 
     *                      'curlHeaderSize' => headers of that request, 
     *                      'sBody' => Body of html of the request
     *                  ]);
     */
    public function makeAPOSTCallToShopify($data, $shopifyURL, $headers = NULL) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $shopifyURL);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers === NULL ? [] : $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, 0);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $aHeaderInfo = curl_getinfo($ch);
        $curlHeaderSize = $aHeaderInfo['header_size'];
        $sBody = trim(mb_substr($result, $curlHeaderSize));

        return ['httpCode' => $httpCode, 'result' => $result, 'aHeaderInfo' => $aHeaderInfo, 'curlHeaderSize' => $curlHeaderSize, 'sBody' => $sBody];
    }

    /**
     * Does calling the Shopify URL via GET method. (Guzzle HTTP package is used)
     * @param a URL (Shopify), params(GET) assumed NULL and array of headers
     * @return the contents of the request 
    */

    public function makeAGETCallToShopify($url, $request_params=[], $headers, $method = 'GET'){
        try{
            $client = new Client();
            switch($method) {
                case 'GET' : $response = $client->get($url, [ 'headers' => $headers ]); break;
                case 'DELETE' : $response = $client->delete($url, [ 'headers' => $headers ]); break;
                case 'PUT' : $response = $client->put($url, [ 'headers' => $headers ]); break;
            }
            return $response->getBody()->getContents();
        } catch(ClientException $exception){
            if($exception->getCode() == '401') throw new \Exception('Unauthorized', 401);
            else throw new \Exception($exception);    
        }   
    }

    public function makeAGETCallToLogistics($url, $headers){
        $client = new Client();
        try{
            $response = $client->get($url, ['headers' => $headers]);
            return $response->getBody()->getContents();
        } catch(Exception $e){
            Log::info('Tried Accessing '.$url.'. Got exception - '.$e->getMessage());
            return false;
        }
    }

    public function makeAPOSTCallWithJSONBody($url, $body, $headers) {
        $ch = curl_init();
        $curlOptions = [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $body
        ];
        curl_setopt_array($ch, $curlOptions);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return ['httpCode' => $httpCode, 'response' => $response];
    }
}