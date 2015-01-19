<?php

namespace JJ\MainBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\ResultSetMapping;

/**
 * SongRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SongRepository extends EntityRepository
{
    /**
     * Count all
     *
     * @return int
     */
    public function countAll()
    {
        $query = $this->getEntityManager()->createQuery("
                SELECT COUNT(s)
                FROM MainBundle:Song s
            ");
        return (int) $query->getSingleScalarResult();
    }

    /**
     * Find random
     *
     * @param $countSongs
     * @return Song
     */
    public function findRandom($countSongs)
    {
        $pointer = rand(0, $countSongs - 1);
        $query = $this->getEntityManager()->createQuery("
                SELECT s
                FROM MainBundle:Song s
            ")
            ->setMaxResults(1)
            ->setFirstResult($pointer);
        return $query->getSingleResult();
    }

    /**
     * Find last played at song
     *
     * @return \DateTime
     */
    public function findLastPlayedAt()
    {
        $query = $this->getEntityManager()->createQuery("
                SELECT MIN(s.playedAt)
                FROM MainBundle:Song s
            ");
        $result = $query->getSingleScalarResult();
        return new \DateTime($result);
    }

    /**
     * Find avg played at song
     * Native MySQL query
     *
     * @return \DateTime
     */
    public function findAvgPlayedAt()
    {
	    $rsm = new ResultSetMapping();
	    $rsm->addScalarResult('avgPlayedAt', 'avgPlayedAt');
	    $query = $this->getEntityManager()->createNativeQuery("
                SELECT ROUND(AVG(UNIX_TIMESTAMP(played_at))) avgPlayedAt
                FROM s_song
            ", $rsm);
        $result = $query->getSingleScalarResult();
	    //die(var_dump($result));
        return new \DateTime(date('Y-m-d', $result));
    }

    /**
     * Max count played
     *
     * @return int
     */
    public function maxCountPlayed()
    {
        $query = $this->getEntityManager()->createQuery("
              SELECT MAX(s.countPlayed)
              FROM MainBundle:Song s
            ");
        return $query->getSingleScalarResult();
    }

    /**
     * Max count rated
     *
     * @return int
     */
    public function maxCountRated()
    {
        $query = $this->getEntityManager()->createQuery("
              SELECT MAX(s.countRated)
              FROM MainBundle:Song s
            ");
        return $query->getSingleScalarResult();
    }

    /**
     * Find closest
     *
     * @return Song
     */
    public function findClosest($timeRange, $excludeIds, $limit, $priorityWeight)
    {
        $priorityWeight *= 2;
	    $rsm = new ResultSetMapping();
	    $rsm->addEntityResult('MainBundle:Song', 's');
	    $rsm->addFieldResult('s', 'id', 'id');
	    $rsm->addScalarResult('playedWeight', 'playedWeight');
        $query = $this->getEntityManager()->createNativeQuery("
              SELECT id, ((priority * :priorityWeight) + (UNIX_TIMESTAMP() - IFNULL(UNIX_TIMESTAMP(played_at), 1) / :timeRange)) playedWeight
              FROM s_song
              WHERE id NOT IN (:excludeIds)
              ORDER BY playedWeight DESC
              LIMIT :limit
            ", $rsm);
	    $query->setParameter('timeRange', $timeRange);
	    $query->setParameter('excludeIds', $excludeIds);
	    $query->setParameter('limit', $limit * 10);
	    $query->setParameter('priorityWeight', $priorityWeight);
        $result = $query->getResult();
	    shuffle($result);
	    $result = array_slice($result, 0, $limit);
	    //die(var_dump($result));
	    $this->clear();

	    $songs = new ArrayCollection();
	    foreach ($result as $songResult) {
		    //die(var_dump($songResult));
		    $songs->add($this->find($songResult[0]->getId()));
	    }

	    //die(var_dump($songs));
	    return $songs;
    }

	public function findUnplayed($excludeIds)
	{
		$query = $this->getEntityManager()->createQuery("
				SELECT s FROM MainBundle:Song s
				WHERE (s.countPlayed = :countPlayed OR s.playedAt = :playedAt)
				AND s.id NOT IN (:excludeIds)
			")
			->setMaxResults(100)
			->setParameters(array(
				'countPlayed' => 0,
				'playedAt' => null,
				'excludeIds' => implode(',', $excludeIds)
			));
		$result = $query->getResult();
		shuffle($result);
		//die(var_dump(count($result)));
		return $result ? $result[0] : null;
	}

	/**
	 * Find by priority with exclusion
	 *
	 * @param $excludeIds
	 * @return Song
	 */
	public function findByPriorityWithExclusion($excludeIds)
	{
		$query = $this->getEntityManager()->createQuery("
				SELECT s FROM MainBundle:Song s
				WHERE s.id NOT IN (:excludeIds)
				ORDER BY s.priority DESC, s.playedAt ASC, s.countPlayed ASC
			")
			->setMaxResults(1)
			->setParameters(array(
				'excludeIds' => $excludeIds
			));
		return $query->getOneOrNullResult();
	}

	/**
	 * Find last rated at with exclusion
	 *
	 * @param $excludeIds
	 * @param $rounds
	 * @return Song[]
	 */
	public function findLastRatedWithExclusion($excludeIds, $rounds)
	{
		$query = $this->getEntityManager()->createQuery("
                SELECT s FROM MainBundle:Song s
                WHERE s.id NOT IN (:excludeIds)
                AND s.countPlayed > 0
                ORDER BY s.ratedAt ASC
            ")
			->setMaxResults($rounds * 10)
			->setParameters(array(
				'excludeIds' => $excludeIds
			))
		;
		$results = $query->getResult();
		shuffle($results);
		return !$results ? null : array_slice($results, 0, $rounds);
	}
}
