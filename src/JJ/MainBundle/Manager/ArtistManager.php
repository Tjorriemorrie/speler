<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\ArtistRepository;
use JJ\MainBundle\Entity\Song;
use Symfony\Component\Validator\Validator;

use Doctrine\Common\Collections\Criteria;

use JJ\MainBundle\Entity\Artist;


/**
 * Artist Manager
 */
class ArtistManager
{
	protected $em;
	protected $validator;
	/** @var ArtistRepository */
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
		$this->repo = $em->getRepository('MainBundle:Artist');
	}

	/**
	 * Validate
	 *
	 * @param Artist $artist
	 * @throws \Exception
	 */
	protected function validate(Artist $artist)
	{
		$violations = $this->validator->validate($artist);
		if ($violations->count()) {
			throw new \Exception((string)$violations, 500);
		}
	}

    /**
     * Get by artist
     *
     * @param $id3
     * @return Artist
     */
    public function getArtist($id3)
    {
        $artist = $this->findOneByName($id3['artistName']);
        if ($artist) {
            return $artist;
        }

        $artist = new Artist();
        $this->em->persist($artist);

        $artist->setName($id3['artistName']);

        $this->validate($artist);
        return $artist;
    }

	/**
	 * Update
	 *
	 * @param Song $song
	 * @param      $formData
	 * @return \JJ\MainBundle\Entity\Artist
	 */
	public function update(Song $song, $formData)
	{
		// create new
		if (filter_var($formData['create'], FILTER_VALIDATE_BOOLEAN)) {
			$artist = $this->findOneByName($formData['name']);
			if (!$artist) {
				$artist = new Artist();
				$this->em->persist($artist);
				$artist->setName($formData['name']);
			}
			$song->setArtist($artist);
		}
		// rename current
		else {
			$artist = $song->getArtist();
			// rename existing
			if ($artist) {
				$artistExist = $this->findOneByName($formData['name']);
				// clean rename
				if (!$artistExist) {
					$artist->setName($formData['name']);
				}
				// conflict: have to change associations for all songs and albums
				else {
					$artistExist->setName($formData['name']);
					foreach ($artist->getSongs() as $artistSong) {
						$artistSong->setArtist($artistExist);
					}
					foreach ($artist->getAlbums() as $artistAlbum) {
						$artistAlbum->setArtist($artistExist);
					}
					$artist = $artistExist;
				}
			}
			// create new
			else {
				$artist = $this->findOneByName($formData['name']);
				if (!$artist) {
					$artist = new Artist();
					$this->em->persist($artist);
					$artist->setName($formData['name']);
				}
				$song->setArtist($artist);
			}
		}

		$this->validate($artist);
		$this->em->flush();
		$this->em->refresh($artist);
		return $artist;
	}

	/**
	 * Update rating
	 *
	 * @param Artist $artist
	 * @return \JJ\MainBundle\Entity\Artist
	 */
	public function updateRating(Artist $artist)
	{
		$this->em->refresh($artist);
		$artist->setCountSongs($artist->getSongs()->count());
		$artist->setCountAlbums($artist->getAlbums()->count());

		$criteria = Criteria::create()
			->orderBy(array('playedAt' => Criteria::DESC))
			->setMaxResults(1);
		/** @var Song $song */
		$song = $artist->getSongs()->matching($criteria)->first();
		if ($song) {
			$artist->setPlayedAt($song->getPlayedAt());
		}

		$countPlayed = 0;
		$winners = 0;
		$losers = 0;
		foreach ($artist->getSongs() as $song) {
			$countPlayed += $song->getCountPlayed();
			$winners += $song->getWinners()->count();
			$losers += $song->getLosers()->count();
		}
		$artist->setCountPlayed($countPlayed);
		$rated = $winners + $losers;
		$artist->setCountRated($rated);
		$artist->setRating(!$rated ? null : $winners / $rated);

		$this->validate($artist);
		$this->em->flush();
		return $artist;
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	// REPO
	//////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Find
	 *
	 * @param $id
	 * @return Artist
	 */
	public function find($id)
	{
		return $this->repo->find($id);
	}

	/**
	 * Find all
	 *
	 * @return Artist[]
	 */
	public function findAll()
	{
		return $this->repo->findAll();
	}

    /**
     * Find one by path
     *
     * @param $name
     * @return Artist
     */
    public function findOneByName($name)
    {
        return $this->repo->findOneByName($name);
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
 }
