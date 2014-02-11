<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\RatingRepository;
use Symfony\Component\Validator\Validator;
use JJ\MainBundle\Manager\SongManager;

use JJ\MainBundle\Entity\Rating;
use JJ\MainBundle\Entity\Song;


/**
 * Rating Manager
 */
class RatingManager
{
	protected $em;
	protected $validator;
	/** @var RatingRepository */
	protected $repo;
    protected $songMan;

    /**
     * Construct
     *
     * @param EntityManager $em
     * @param Validator $validator
     * @param SongManager $songMan
     */
	public function __construct(EntityManager $em, Validator $validator, SongManager $songMan)
	{
		$this->em = $em;
		$this->validator = $validator;
		$this->repo = $em->getRepository('MainBundle:Rating');
        $this->songMan = $songMan;
	}

	/**
	 * Validate
	 *
	 * @param Rating $rating
	 * @throws \Exception
	 */
	protected function validate(Rating $rating)
	{
		$violations = $this->validator->validate($rating);
		if ($violations->count()) {
			throw new \Exception((string)$violations, 500);
		}
	}

	/**
	 * Find matches for ratings
	 *
	 * @param Song[] $songs
	 * @param int[] $excludeIds
	 */
    public function findMatches($songs, $excludeIds)
    {
	    $excludeIds = explode(',', $excludeIds);
	    array_walk($excludeIds, function(&$id) {
		    $id = (int)$id;
	    });

	    foreach ($songs as $song) {
	        $matches = array();
	        $excludeIds = array_merge($excludeIds, $this->getExcludeIds($song));

	        $rounds = $this->countRounds($song);
	        for ($i=1; $i<=$rounds; $i++) {
	            $matches = $this->songMan->findLastRatedWithExclusion($excludeIds, $rounds);
	        }

		    foreach ($matches as $match) {
			    $excludeIds[] = $match->getId();
		    }

	        //die(var_dump(count($matches)));
		    $song->setMatches($matches);
	    }
    }

    /**
     * Get exclude ids for finding a match
     *
     * @param \JJ\MainBundle\Entity\Song $song
     * @return int[]
     */
    public function getExcludeIds(Song $song)
    {
        $excludeIds = array($song->getId());

        foreach ($song->getWinners() as $winner) {
            $excludeIds[] = $winner->getLoser()->getId();
        }

        foreach ($song->getLosers() as $loser) {
            $excludeIds[] = $loser->getWinner()->getId();
        }

        //die(var_dump($excludeIds));
        return $excludeIds;
    }

    /**
     * Count rounds
     *
     * Start with this track as played
     * Target can not be below min (1?) and max (5?)
     *
     * @param \JJ\MainBundle\Entity\Song $song
     * @return int
     */
    public function countRounds(Song $song)
    {
        $rounds = $song->getCountPlayed() + 1;
	    $rounds *= 3;
        $rounds -= $song->getCountRated();
	    $rounds = max(1, $rounds);
        $rounds = min(5, $rounds);
        //die(var_dump($rounds));
//	    if ($rounds) {
//		    $rounds++;
//	    }
        return $rounds;
    }

    /**
     * Find match
     *
     * @param int[] $excludeIds
     * @return Song
     */
    public function findMatch(array $excludeIds)
    {
	    $timeStart = time();
	    $cutStart = 3/5;
        $countSongs = $this->songMan->countAll();
        if (!$countSongs) {
            return null;
        }

        $ratedMax = $this->songMan->maxCountRated();
        $ratedMax = max(1, $ratedMax);
        //die(var_dump($ratedMax));
        $ratedDecrement = $ratedMax / $countSongs;
        //die(var_dump($ratedDecrement));
        $ratedMax *= $cutStart;

        $lastRatedAt = $this->findLastRatedAt();
        //die(var_dump($lastRatedAt));
        $diff = time() - $lastRatedAt->getTimestamp();
        $lastRatedIncrement = max(1, $diff / $countSongs);
        //die(var_dump($lastRatedIncrement));
        $lastRatedAt->modify('+' . round($diff * $cutStart) . ' seconds');

	    //$ratedDecrement *= 10;
	    //$lastRatedIncrement *= 10;

        $start = time();
        do {
            $lastRatedAt->modify('+' . round($lastRatedIncrement) . ' seconds');
            $ratedMax -= $ratedDecrement;

            $song = $this->songMan->findRandom($countSongs);
            //die(var_dump($file));
            if (!$song) {
                return null;
            } elseif (time() - 30 > $timeStart) {
	            return $song;
            }
        } while (in_array($song->getId(), $excludeIds)
            or $song->getCountPlayed() < 1
            or $song->getRatedAt() > $lastRatedAt
            or $song->getCountRated() > $ratedMax
        );

        return $song;
    }

	/**
	 * Create rating
	 *
	 * @param Song $winner
	 * @param Song $loser
	 * @return \JJ\MainBundle\Entity\Rating
	 * @throws \InvalidArgumentException
	 */
	public function create(Song $winner, Song $loser)
	{
		$rating = $this->findByWinnerAndLoser($winner, $loser);
		if ($rating) {
			throw new \InvalidArgumentException('That rating already exists! ' . $rating->getId(), 500);
		}

		$rating = new Rating();
		$this->em->persist($rating);

		$rating->setWinner($winner);
		$rating->setLoser($loser);
		$rating->setRatedAt(new \DateTime());

		$this->validate($rating);
		$this->em->flush();
		return $rating;
	}

	/**
	 * Set result of match
	 *
	 * @param \JJ\MainBundle\Entity\Song $winner
	 * @param \JJ\MainBundle\Entity\Song $loser
	 * @throws \Exception
	 * @return Rating
	 */
    public function setMatch(Song $winner, Song $loser)
    {
	    $rating = $this->create($winner, $loser);

		// songs
	    $this->em->refresh($winner);
	    $this->songMan->updateRating($winner);

	    $this->em->refresh($loser);
	    $this->songMan->updateRating($loser);

	    $this->em->flush();

        return $rating;
    }

	//////////////////////////////////////////////////////////////////////////////////////////
	// REPO
	//////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Find
	 *
	 * @param $id
	 * @return Rating
	 */
	public function find($id)
	{
		return $this->repo->find($id);
	}

	/**
	 * Find all
	 *
	 * @return Rating[]
	 */
	public function findAll()
	{
		return $this->repo->findAll();
	}

    /**
     * Find last rated at
     *
     * @return \DateTime
     */
    public function findLastRatedAt()
    {
        return $this->repo->findLastRatedAt();
    }

	/**
	 * Find one by winner and loser
	 *
	 * @param Song $winner
	 * @param Song $loser
	 * @return Rating
	 */
	public function findByWinnerAndLoser(Song $winner, Song $loser)
	{
		$criteria = array(
			'winner' => $winner,
			'loser' => $loser
		);
		$asc = $this->repo->findOneBy($criteria);
		if ($asc) {
			return $asc;
		}

		$criteria = array(
			'loser' => $winner,
			'winner' => $loser
		);
		return $this->repo->findOneBy($criteria);

	}
}
