<?php

namespace JJ\MainBundle\Service;

use Buzz\Browser;
use Buzz\Message\Response;

/**
 * Last FM
 */
class LastFm
{
    protected $api_key;
    protected $api_secret;
    protected $api_endpoint;
    protected $session_key;

    /**
     * Construct
     */
    public function __construct()
    {
        $this->api_key = '2b532992c84242d372f5c0044d6883e5';
        $this->api_secret = '3c6688ac84deda063a697f5662a93eb0';
        $this->api_endpoint = 'http://ws.audioscrobbler.com/2.0/';
    }

    /**
     * Set session key
     * @param $sessionKey
     */
    public function setSessionKey($sessionKey)
    {
        $this->session_key = $sessionKey;
    }

    /**
     * Get URL
     * @param $params
     * @return string
     */
    protected function getUrl($params)
    {
        $sig = '';
        $url = $this->api_endpoint . '?';
        $questionUsed = false;
        foreach ($params as $key => $value) {
            $sig .= $key . $value;
            if (!$questionUsed) $questionUsed = true;
            else $url .= '&';
            $url .= $key . '=' . urlencode($value);
        }
        $sig = md5($sig . $this->api_secret);
        $url .= '&api_sig=' . $sig;

        return $url;
    }

    /**
     * Get response
     * @param $params
     * @return \SimpleXMLElement
     * @throws \Exception
     */
    protected function getResponse($params)
    {
        $url = $this->getUrl($params);

        $xmlstr = file_get_contents($url);
        if ($xmlstr === false) {
            $error = error_get_last();
            throw new \Exception($error['message']);
        }

        $xml = new \SimpleXMLElement($xmlstr);
        //$response = json_decode(json_encode($xml), true);
        //die(var_dump($response));

        if ((string)$xml->attributes()->{'status'} !== 'ok') {
            throw new \Exception(trim((string)$xml->{'error'}));
        }

        return $xml;
    }

    /**
     * Generates Signature for POST
     * @param $postVars
     * @return string
     */
    protected function generateSignature(&$postVars)
    {
        ksort($postVars);

        $string = '';
        foreach ($postVars as $key => $value) {
            $string .= $key . $value;
        }

        $string .= $this->api_secret;

        return md5($string);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Request web session
     * @param $token
     * @throws \Exception|Exception
     * @return string
     */
    public function requestWebSession($token)
    {
        $params = array(
            'api_key' => $this->api_key,
            'method'  => 'auth.getSession',
            'token'   => $token
        );

        $xml = $this->getResponse($params);
        //die(var_dump($xml));

        $data = array(
            'name' => (string)$xml->{'session'}->{'name'},
            'key' => (string)$xml->{'session'}->{'key'},
            'subscriber' => (string)$xml->{'session'}->{'subscriber'},
        );

        return $data;
    }

    /**
     * Scrobbles Track
     */
    public function scrobble($trackName, $artistName, $albumName = null, $trackNumber = null)
    {
        $postFields = array(
            'api_key' => $this->api_key,
            'sk' => $this->session_key,
            'method' => 'track.scrobble',
            'artist' => $artistName,
            'track' => $trackName,
            'timestamp' => gmdate(time()),
        );
        if (!is_null($albumName)) {
            $postFields['album'] = $albumName;
        }
        if (!is_null($trackNumber)) {
            $postFields['trackNumber'] = $trackNumber;
        }
        $postFields['api_sig'] = $this->generateSignature($postFields);
        //die(var_dump($postFields));

        $postData = http_build_query($postFields);
        //die(var_dump($postData));

        /** @var $response Response */
        $buzz = new Browser();
        $response = $buzz->post($this->api_endpoint, array(), $postData);

        $xml = new \SimpleXMLElement($response->getContent());
        //die(var_dump($xml));

        if ((string)$xml->attributes()->{'status'} !== 'ok') {
            throw new \Exception(trim((string)$xml->{'error'}));
        }

        return (string)$xml->{'scrobbles'}->attributes()->{'accepted'};
    }

    /**
     * Update Now Playing
     * @param      $trackName
     * @param      $artistName
     * @param null $albumName
     * @param null $trackNumber
     * @throws \Exception
     * @return result[]
     */
    public function nowPlaying($trackName, $artistName, $albumName = null, $trackNumber = null)
    {
        $postFields = array(
            'api_key' => $this->api_key,
            'sk' => $this->session_key,
            'method' => 'track.updateNowPlaying',
            'track' => $trackName,
            'artist' => $artistName,
        );
        if (!is_null($albumName)) {
            $postFields['album'] = $albumName;
        }
        if (!is_null($trackNumber)) {
            $postFields['trackNumber'] = $trackNumber;
        }

        $postFields['api_sig'] = $this->generateSignature($postFields);
        //die(var_dump($postFields));

        $postData = http_build_query($postFields);
        //die(var_dump($postData));

        /** @var $response Response */
        $buzz = new Browser();
        $response = $buzz->post($this->api_endpoint, array(), $postData);

        $xml = new \SimpleXMLElement($response->getContent());
        //die(var_dump($xml));

        if ((string)$xml->attributes()->{'status'} !== 'ok') {
            throw new \Exception(trim((string)$xml->{'error'}), 500);
        }

        if ((string)$xml->{'nowplaying'}->{'track'}->attributes()->{'corrected'}) {
//            throw new \Exception('Track corrected!', 500);
        }

        if ((string)$xml->{'nowplaying'}->{'artist'}->attributes()->{'corrected'}) {
//            throw new \Exception('Artist corrected!', 500);
        }

        if ((string)$xml->{'nowplaying'}->{'album'}->attributes()->{'corrected'}) {
//            throw new \Exception('Album corrected!', 500);
        }

        return true;
    }

    /**
     * (Un)Love Track
     */
    public function love($love, $trackName, $artistName)
    {
        $postFields = array(
            'api_key' => $this->api_key,
            'sk' => $this->session_key,
            'method' => $love ? 'track.love' : 'track.unlove',
            'track' => $trackName,
            'artist' => $artistName,
        );

        $postFields['api_sig'] = $this->generateSignature($postFields);
        //die(var_dump($postFields));

        $postData = http_build_query($postFields);
        //die(var_dump($postData));

        /** @var $response Response */
        $buzz = new Browser();
        $response = $buzz->post($this->api_endpoint, array(), $postData);

        $xml = new \SimpleXMLElement($response->getContent());
        //die(var_dump($xml));

        if ((string)$xml->attributes()->{'status'} !== 'ok') {
            throw new \Exception(trim((string)$xml->{'error'}));
        }

        return true;
    }
}
