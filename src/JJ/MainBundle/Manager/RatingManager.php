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
     * @param \JJ\MainBundle\Entity\Song $song
     * @return Song[]
     */
    public function findMatches(Song $song)
    {
        $matches = array();
        $excludeIds = $this->getExcludeIds($song);

        $rounds = $this->countRounds($song);
        for ($i=1; $i<=$rounds; $i++) {
            $match = $this->findMatch($excludeIds);
            //die(var_dump($match));
            if (!$match) {
                break;
            } else {
                $matches[] = $match;
                $excludeIds[] = $match->getId();
            }
        }

        //die(var_dump(count($matches)));
        return $matches;
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
        $target = $song->getCountPlayed() + 1;
        $rounds = $target - $song->getCountRated();
        $rounds = min(6, $rounds);
        $rounds = max(2, $rounds);
        //die(var_dump($rounds));
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
        $countSongs = $this->songMan->countAll();
        if (!$countSongs) {
            return null;
        }

        $ratedMax = $this->songMan->maxCountRated();
        $ratedMax = max(1, $ratedMax);
        //die(var_dump($ratedMax));
        $ratedDecrement = $ratedMax / $countSongs;
        //die(var_dump($ratedDecrement));
        $ratedMax /= 2;

        $lastRatedAt = $this->findLastRatedAt();
        //die(var_dump($lastRatedAt));
        $diff = time() - $lastRatedAt->getTimestamp();
        $lastRatedIncrement = max(1, $diff / $countSongs);
        //die(var_dump($lastRatedIncrement));
        $lastRatedAt->modify('+' . round($diff / 2) . ' seconds');

        $iteration = 0;
        do {
            $iteration++;
            if ($iteration > $countSongs) {
                return null;
            }

            $lastRatedAt->modify('+' . round($lastRatedIncrement) . ' seconds');
            $ratedMax -= $ratedDecrement;

            $song = $this->songMan->findRandom($countSongs);
            //die(var_dump($file));
            if (!$song) {
                return null;
            }
        } while (in_array($song->getId(), $excludeIds)
            or $song->getCountPlayed() < 1
            or $song->getRatedAt() > $lastRatedAt
            or $song->getCountRated() > $ratedMax
        );

        return $song;
    }

    /**
     * Set result of match
     * @return Rating
     */
    public function setMatch(UserTrack $winner, UserTrack $loser)
    {
        $rating = $this->findByWinnerAndLoser($winner, $loser);
        if ($rating) {
            throw new \Exception('That rating already exists! ' . $rating->getId(), 500);
        }

        $rating = new Rating();
        $rating->setUser($winner->getUser());
        $rating->setRatedAt(new \DateTime());
        $rating->setWinner($winner);
        $rating->setLoser($loser);

        $this->validate($rating);
        $this->em->persist($rating);
        $this->em->flush();

        //die(var_dump('winner = ' . $winner->getId() . ' and loser = ' . $loser->getId()));
//        $this->em->clear();
//        $winner = $this->userTrackMan->find($winner->getId());
        $winner->setRatedAt(new \DateTime());
        $this->playerMan->updateChain($winner);

//        $this->em->clear();
//        $loser = $this->userTrackMan->find($loser->getId());
        $loser->setRatedAt(new \DateTime());
        $this->playerMan->updateChain($loser);

        $this->historyMan->createByRating($rating);

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
}
