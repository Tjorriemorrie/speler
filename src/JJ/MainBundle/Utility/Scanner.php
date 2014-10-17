<?php

namespace JJ\MainBundle\Utility;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Utility\Identifier;
use JJ\MainBundle\Manager\SongManager;
use JJ\MainBundle\Manager\AlbumManager;
use JJ\MainBundle\Manager\ArtistManager;

use JJ\MainBundle\Entity\Song;
use JJ\MainBundle\Entity\Album;
use JJ\MainBundle\Entity\Artist;

class Scanner
{
    protected $em;
    protected $identifier;
    protected $songMan;
    protected $albumMan;
    protected $artistMan;

    protected $extensionsAllowed = array('mp3', 'm4a');
    protected $extensionsBlocked = array('jpg', 'db', 'ds_store', 'nfo', 'm3u');

    /**
     * Construct
     *
     * @param \Doctrine\ORM\EntityManager $em
     * @param Identifier $identifier
     * @param SongManager $songMan
     * @param \JJ\MainBundle\Manager\AlbumManager $albumMan
     * @param \JJ\MainBundle\Manager\ArtistManager $artistMan
     */
    public function __construct(EntityManager $em, Identifier $identifier, SongManager $songMan, AlbumManager $albumMan, ArtistManager $artistMan)
    {
        $this->em = $em;
        $this->identifier = $identifier;
        $this->songMan = $songMan;
        $this->albumMan = $albumMan;
        $this->artistMan = $artistMan;
    }

    /**
     * Run
     */
    public function run()
    {
        $this->clean();
        $this->scan();
    }

    /**
     * Clean
     */
    public function clean()
    {
        foreach ($this->songMan->findAll() as $song) {
            if (!$song->fileExists()) {
                $this->em->remove($song);
            }
        }
        $this->em->flush();

        foreach ($this->albumMan->findAll() as $album) {
            if (!$album->getSongs()) {
                $this->em->remove($album);
            }
        }
        $this->em->flush();

        foreach ($this->artistMan->findAll() as $artist) {
            if (!$artist->getSongs() && !$artist->getAlbums()) {
                $this->em->remove($artist);
            }
        }
        $this->em->flush();
    }

    /**
     * Scan
     */
    public function scan()
    {
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(PATH_AUDIO), \RecursiveIteratorIterator::SELF_FIRST);
        /** @var \SplFileInfo $file */
        foreach($files as $path => $file) {
            //die(var_dump($name));
            //die(var_dump($file));

            if ($file->isDir()) {
                continue;
            }

            $ext = $file->getExtension();
            if (in_array(strtolower($ext), $this->extensionsAllowed, true)) {
                $this->addSong($path, $file);
            } elseif (in_array(strtolower($ext), $this->extensionsBlocked, true)) {
                unlink($file) || die('could not unlink file ' . $file);
            } else {
                throw new \Exception('unknown ext ' . $ext);
            }
        }
    }


    /**
     * Add song
     *
     * @param $path
     * @param $file
     * @return Song
     */
    protected function addSong($path, \SplFileInfo $file)
    {
        $id3 = $this->identifier->getId3($path);
        $path = str_replace(PATH_AUDIO, '', $path);
        $path = str_replace('\\', '/', $path);
        $path = substr($path, 1);

        $song = $this->songMan->findOneByPath($path);
        if ($song) {
            return $song;
        }
        $song = $this->songMan->create($path, $file, $id3);

        if ($id3['albumName']) {
            $album = $this->albumMan->getAlbum($id3);
        }

        if ($id3['artistName']) {
            $artist = $this->artistMan->getArtist($id3);
        }

        if (isset($artist)) {
            $song->setArtist($artist);
            if (isset($album)) {
                $album->setArtist($artist);
            }
        }

        if (isset($album)) {
            $song->setAlbum($album);
        }

        $this->em->flush();
        return $song;
    }
}
