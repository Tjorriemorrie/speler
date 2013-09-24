<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\SongRepository;
use Symfony\Component\Validator\Validator;

use JJ\MainBundle\Entity\Song;


/**
 * Song Manager
 */
class SongManager
{
	protected $em;
	protected $validator;
	/** @var SongRepository */
	protected $repo;

	/**
	 * Construct
	 *
	 * @param EntityManager        $em
	 * @param Validator            $validator
	 */
	public function __construct(EntityManager $em, Validator $validator)
	{
		$this->em = $em;
		$this->validator = $validator;
		$this->repo = $em->getRepository('MainBundle:Song');
	}

	/**
	 * Validate
	 *
	 * @param Song $song
	 * @throws \Exception
	 */
	protected function validate(Song $song)
	{
		$violations = $this->validator->validate($song);
		if ($violations->count()) {
			throw new \Exception((string)$violations, 500);
		}
	}

    /**
     * Create
     *
     * @param $path
     * @param \SplFileInfo $file
     * @param $id3
     * @return Song
     */
    public function create($path, \SplFileInfo $file, $id3)
    {
        $song = new Song();
        $this->em->persist($song);

        $song->setPath($path);
        $song->setExtension($file->getExtension());

        $song->setPlayedAt(null);
        $song->setCountPlayed(0);
        $song->setPriority(1);
        $song->setRated(0);

        $song->setName($id3['trackName']);
        $song->setNumber($id3['trackNumber']);

        if (!$song->getName()) {
            $song->setName($file->getBasename());
        }

        $this->validate($song);
        return $song;
    }

    /**
     * Get next two
     *
     * @param $ids
     * @return Song[]
     */
    public function getNextTwo($ids)
    {
        $excludeIds = explode(',', $ids);

        $songs = array();
        while (count($songs) < 2) {
            $song = $this->getNext($excludeIds);
            if (!$song) {
                break;
            }

            $songs[] = $song;
            $excludeIds[] = $song->getId();
        }

        return $songs;
    }

    /**
     * Get next
     *
     * @param $excludeIds
     * @return Song|null
     */
    public function getNext($excludeIds)
    {
        $countSongs = $this->countAll();
        if (!$countSongs) {
            return null;
        }
        //die(var_dump($countSongs));

        $priorityCutOff = 1;
        $priorityDecrement = $priorityCutOff / $countSongs;
        $priorityCutOff /= 2;

        $lastPlayedAt = $this->findLastPlayedAt();
        $diff = time() - $lastPlayedAt->getTimestamp();
        $timeIncrement = max(1, $diff / $countSongs);
        $lastPlayedAt->modify('+' . round($diff / 2) . ' seconds');

        $iteration = 0;
        do {
            $iteration++;
            if ($iteration > $countSongs) {
                return null;
            }

            $priorityCutOff -= $priorityDecrement;
            $lastPlayedAt->modify('+' . round($timeIncrement) . ' seconds');

            $song = $this->findRandom($countSongs);
            if (!$song) {
                return null;
            }
        } while (in_array($song->getId(), $excludeIds)
            or $song->getPriority() < $priorityCutOff
            or $song->getPlayedAt() > $lastPlayedAt
        );

        return $song;
    }

    /**
     * Accrete
     *
     * @param Song $song
     */
    public function accrete(Song $song)
    {
        $song->setPlayedAt(new \DateTime());
        $song->setCountPlayed($song->getCountPlayed() + 1);

        $this->updatePriority($song);

        $this->validate($song);
        $this->em->flush();
    }

    /**
     * Update priority
     *
     * @param Song $song
     */
    public function updatePriority(Song $song)
    {
//        $userTrack->setRated($userTrack->getWinners()->count() + $userTrack->getLosers()->count());
//        if ($userTrack->getRated()) {
//            $rating = $userTrack->getWinners()->count() / $userTrack->getRated();
//        } else {
            $rating = 1;
//        }
//        $userTrack->setRating($rating);
        // set rated_at will be set by the rater::match() function.

        $maxCountPlayed = max($song->getCountPlayed(), $this->maxCountPlayed(), 1);
        $weightCountPlayed = $song->getCountPlayed() / $maxCountPlayed;

        $priority = abs($rating) - abs($weightCountPlayed * 99/100) - abs((1 - $rating) * 99/100);
        $priority = max(-1, $priority);
        $song->setPriority($priority);
    }

	//////////////////////////////////////////////////////////////////////////////////////////
	// REPO
	//////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Find
	 *
	 * @param $id
	 * @return Song
	 */
	public function find($id)
	{
		return $this->repo->find($id);
	}

	/**
	 * Find all
	 *
	 * @return Song[]
	 */
	public function findAll()
	{
		return $this->repo->findAll();
	}

    /**
     * Find one by path
     *
     * @param $path
     * @return Song
     */
    public function findOneByPath($path)
    {
        return $this->repo->findOneByPath($path);
    }

    /**
     * Count all
     *
     * @return int
     */
    public function countAll()
    {
        return $this->repo->countAll();
    }

    /**
     * Find random
     *
     * @param $countSongs
     * @return Song
     */
    public function findRandom($countSongs)
    {
        return $this->repo->findRandom($countSongs);
    }

    /**
     * Find last played at
     *
     * @return \DateTime
     */
    public function findLastPlayedAt()
    {
        return $this->repo->findLastPlayedAt();
    }

    /**
     * Max count played
     *
     * @return int
     */
    public function maxCountPlayed()
    {
        return $this->repo->maxCountPlayed();
    }

    /**
     * Max count rated
     *
     * @return int
     */
    public function maxCountRated()
    {
        return $this->repo->maxCountRated();
    }
}
