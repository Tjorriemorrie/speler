<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\SongRepository;
use Symfony\Component\Validator\Validator;
use JJ\MainBundle\Manager\AlbumManager;

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
	protected $albumMan;

	/**
	 * Construct
	 *
	 * @param EntityManager $em
	 * @param Validator     $validator
	 * @param AlbumManager  $albumMan
	 */
	public function __construct(EntityManager $em, Validator $validator, AlbumManager $albumMan)
	{
		$this->em = $em;
		$this->validator = $validator;
		$this->repo = $em->getRepository('MainBundle:Song');
		$this->albumMan = $albumMan;
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
        $song->setExtension(strtolower($file->getExtension()));

        $song->setPlayedAt(null);
        $song->setCountPlayed(0);
        $song->setPriority(1);
        $song->setCountRated(0);

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
	    array_walk($excludeIds, function(&$id) {
		    $id = (int)$id;
	    });
	    //die(var_dump($excludeIds));

	    $lastPlayedAt = $this->findLastPlayedAt()->getTimestamp();
	    $timeRange = time() - $lastPlayedAt;
	    $avgPlayedAt = $this->findAvgPlayedAt()->getTimestamp();
	    $priorityWeight = $avgPlayedAt / $lastPlayedAt;
        $songs = $this->repo->findClosest($timeRange, $excludeIds, 2, $priorityWeight);

        return $songs;
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
     * AVG of:
     * 1. rating (wins / total rated)
     * 2. playcount (count / total played)
     * 3. playedAt (played in relation to last overall played rnage)
     *
     * If unplayed, then priority is 1
     *
     * @param Song $song
     */
    public function updatePriority(Song $song)
    {
	    if (!$song->getPlayedAt() || !$song->getCountPlayed()) {
		    $priority = 1;
	    } else {
		    // 1 quality or value
		    $ratingWeight = $song->getRating();

		    // 2 repetition (enhances quality)
		    $maxCountPlayed = max($song->getCountPlayed(), $this->maxCountPlayed(), 1);
	        $playCountWeight = ($maxCountPlayed - $song->getCountPlayed()) / $maxCountPlayed;

		    // 3 repetition (resists quality)
//	        $lastPlayedRange = time() - $this->findLastPlayedAt()->getTimestamp();
//			$playedAtWeight = (time() - $song->getPlayedAt()->getTimestamp()) / $lastPlayedRange;

		    $priority = (
			    $ratingWeight * 0.90 +
			    $playCountWeight * 0.10
		    );
	    }
        $song->setPriority($priority);

	    if ($song->getAlbum()) {
	        $this->albumMan->updateRating($song->getAlbum());
	    }
    }

	/**
	 * Update rating
	 *
	 * @param Song $song
	 */
	public function updateRating(Song $song)
	{
		$song->setRatedAt(new \DateTime());
		$song->setCountRated($song->getWinners()->count() + $song->getLosers()->count());
		$song->setRating(!$song->getCountRated() ? 1 : $song->getWinners()->count() / $song->getCountRated());
		$this->updatePriority($song);
	}

	/**
	 * Update
	 *
	 * @param Song $song
	 * @param      $formData
	 * @return Song
	 */
	public function update(Song $song, $formData)
	{
		$song->setName($formData['name']);
		$song->setNumber(filter_var($formData['number'], FILTER_VALIDATE_INT, array('flags' => FILTER_NULL_ON_FAILURE)));

		$this->validate($song);
		$this->em->flush();

		return $song;
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
     * Find avg played at
     *
     * @return \DateTime
     */
    public function findAvgPlayedAt()
    {
        return $this->repo->findAvgPlayedAt();
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

	/**
	 * Find by priority with exclusion
	 *
	 * @param $excludeIds
	 * @return Song
	 */
	public function findByPriorityWithExclusion($excludeIds)
	{
		return $this->repo->findByPriorityWithExclusion($excludeIds);
	}

	public function findUnplayed($excludeIds)
	{
		return $this->repo->findUnplayed($excludeIds);
	}

	/**
	 * Find last rated with exclusion
	 *
	 * @param $exclusionIds
	 * @param $round
	 * @return Song[]
	 */
	public function findLastRatedWithExclusion($exclusionIds, $rounds)
	{
		return $this->repo->findLastRatedWithExclusion($exclusionIds, $rounds);
	}
}
