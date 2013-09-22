<?php

namespace JJ\MainBundle\Utility;

use GetId3\GetId3Core as GetId3;

/**
 * Identifier
 */
class Identifier
{
    /**
     * Get ID3v2 info
     * @param $path
     * @return \GetId3\type
     */
    public function getId3($path)
    {
        $getId3 = new GetId3();
        $getId3->option_md5_data = false;
        $getId3->option_md5_data_source = false;
        $getId3->encoding = 'UTF-8';

        $id3Info = $getId3->analyze($path);
        //die(var_dump($id3Info['tags']['id3v2']));

        $data['artistName'] = isset($id3Info['tags']['id3v2']['artist'][0]) ? $id3Info['tags']['id3v2']['artist'][0] : null;
        $data['albumName'] = isset($id3Info['tags']['id3v2']['album'][0]) ? $id3Info['tags']['id3v2']['album'][0] : null;
        $data['albumYear'] = isset($id3Info['tags']['id3v2']['year'][0]) ? ((int)$id3Info['tags']['id3v2']['year'][0] > 1900 ? (int)$id3Info['tags']['id3v2']['year'][0] : null) : null;
        $data['trackName'] = isset($id3Info['tags']['id3v2']['title'][0]) ? $id3Info['tags']['id3v2']['title'][0] : null;

        $trackInfo = isset($id3Info['tags']['id3v2']['track_number'][0]) ? $id3Info['tags']['id3v2']['track_number'][0] : null;
        @list($trackNumber, $albumCapacity) = explode('/', $trackInfo);
        $data['trackNumber'] = (int)$trackNumber > 0 ? (int)$trackNumber : null;
        $data['albumCapacity'] = (int)$albumCapacity > 0 ? (int)$albumCapacity : null;

        //die(var_dump($data));
        return $data;
    }
}
