<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use JJ\MainBundle\Entity\Song;
use Symfony\Component\Validator\Validator;
use JJ\MainBundle\Service\LastFm as LastFmService;
use JJ\MainBundle\Entity\LastFm;

/**
 * LastFm Manager
 */
class LastFmManager
{
    protected $em;
    /** @var EntityRepository */
    protected $repo;
    protected $validator;
    protected $lastFmService;

    /**
     * Constructor
     */
    public function __construct(EntityManager $em, Validator $validator, LastFmService $lastFmService)
    {
        $this->em = $em;
        $this->repo = $em->getRepository('MainBundle:LastFm');
        $this->validator = $validator;
        $this->lastFmService = $lastFmService;
    }

    /**
     * Validate
     * @param LastFm $lastFm
     * @return bool
     * @throws \Exception
     */
    public function validate(LastFm $lastFm)
    {
        $violations = $this->validator->validate($lastFm);
        if ($violations->count()) {
            throw new \Exception((string)$violations, 500);
        }

        return true;
    }

	/**
	 * Get session
	 *
	 * @param      $id
	 * @param      $token
	 * @return LastFm $lastFm
	 */
    public function requestSession($id, $token)
    {
        $data = $this->lastFmService->requestWebSession($token);
        //die(var_dump($data));

        $lastFm = $this->setSession($id, $data);
        return $lastFm;
    }

	/**
	 * Set session
	 *
	 * @param      $id
	 * @param      $data
	 * @internal param $session
	 * @return \JJ\MainBundle\Entity\LastFm
	 * @return LastFm
	 */
    public function setSession($id, $data)
    {
	    $lastFm = $this->find($id);
        if (!$lastFm) {
            $lastFm = new LastFm();
            $this->em->persist($lastFm);
        }

        $lastFm->setServiceSession($data['key']);
        $lastFm->setScreenName($data['name']);
        $lastFm->setAuthorisedAt(new \DateTime());

        $this->validate($lastFm);
        $this->em->flush();
        return $lastFm;
    }

	/**
	 * Scrobble
	 *
	 * @param                            $id
	 * @param \JJ\MainBundle\Entity\Song $song
	 * @throws \Exception
	 * @internal param \JJ\MainBundle\Manager\File $file
	 * @return bool
	 */
    public function scrobble($id, Song $song)
    {
	    $lastFm = $this->find($id);
	    if (!$lastFm) {
		    throw new \Exception('No lastFm session', 403);
	    }

	    if (!$song->getName()) {
		    throw new \Exception('Song does not have a name', 400);
	    }

	    if (!$song->getArtist()) {
		    throw new \Exception('Song does not have an artist', 400);
	    }

        $this->lastFmService->setSessionKey($lastFm->getServiceSession());

	    $trackName = $song->getName();
	    $artistName = $song->getArtist()->getName();
	    $albumName = $song->getAlbum() ? $song->getAlbum()->getName() : null;
	    $trackNumber = $song->getNumber() ? $song->getNumber() : null;

        $response = $this->lastFmService->scrobble($trackName, $artistName, $albumName, $trackNumber);
        if (!$response) {
            throw new \Exception('No track was scrobbled', 500);
        }

        return true;
    }

	/**
	 * Now playing
	 *
	 * @param                            $id
	 * @param \JJ\MainBundle\Entity\Song $song
	 * @throws \Exception
	 * @return bool
	 */
    public function nowPlaying($id, Song $song)
    {
	    $lastFm = $this->find($id);
        if (!$lastFm) {
	        throw new \Exception('No lastFm session', 403);
        }

        if (!$song->getName()) {
	        throw new \Exception('Song does not have a name', 400);
        }

        if (!$song->getArtist()) {
	        throw new \Exception('Song does not have an artist', 400);
        }

        $this->lastFmService->setSessionKey($lastFm->getServiceSession());

        $trackName = $song->getName();
        $artistName = $song->getArtist()->getName();
        $albumName = $song->getAlbum() ? $song->getAlbum()->getName() : null;
        $trackNumber = $song->getNumber() ? $song->getNumber() : null;

        $response = $this->lastFmService->nowPlaying($trackName, $artistName, $albumName, $trackNumber);
        if (!$response) {
            throw new \Exception('Now playing could not update', 500);
        }

        return true;
    }


    /**
     * Love
     * @param File $file
     * @throws \Exception
     * @return bool
     */
    public function love($id, Song $song)
    {
	    $lastFm = $this->find($id);
	    if (!$lastFm) {
		    throw new \Exception('No lastFm session', 403);
	    }

	    if (!$song->getName()) {
		    throw new \Exception('Song does not have a name', 400);
	    }

	    if (!$song->getArtist()) {
		    throw new \Exception('Song does not have an artist', 400);
	    }

	    $this->lastFmService->setSessionKey($lastFm->getServiceSession());

	    $trackName = $song->getName();
	    $artistName = $song->getArtist()->getName();

        $love = false;
        if ($song->getCountRated() >= 9) {
            if ($song->getRating() >= 0.90) {
                $love = true;
            }
        }

        $response = $this->lastFmService->love($love, $trackName, $artistName);
        if (!$response) {
            throw new \Exception('No track could not be (un)loved', 500);
        }

        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // REPO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Find
     * @param $id
     * @return LastFm
     */
    public function find($id)
    {
        return $this->repo->find($id);
    }

    /**
     * Find all
     * @return LastFm[]
     */
    public function findAll()
    {
        return $this->repo->findAll();
    }
}
