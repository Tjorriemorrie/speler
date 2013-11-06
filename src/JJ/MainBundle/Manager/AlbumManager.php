<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\AlbumRepository;
use Symfony\Component\Validator\Validator;

use JJ\MainBundle\Entity\Album;
use JJ\MainBundle\Entity\Song;


/**
 * Album Manager
 */
class AlbumManager
{
	protected $em;
	protected $validator;
	/** @var AlbumRepository */
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
		$this->repo = $em->getRepository('MainBundle:Album');
	}

	/**
	 * Validate
	 *
	 * @param Album $album
	 * @throws \Exception
	 */
	protected function validate(Album $album)
	{
		$violations = $this->validator->validate($album);
		if ($violations->count()) {
			throw new \Exception((string)$violations, 500);
		}
	}

    /**
     * Get by album
     *
     * @param $id3
     * @return Album
     */
    public function getAlbum($id3)
    {
        $album = $this->findOneByName($id3['albumName']);
        if ($album) {
            return $album;
        }

        $album = new Album();
        $this->em->persist($album);

        $album->setName($id3['albumName']);
        $album->setSize($id3['albumCapacity']);
        $album->setYear($id3['albumYear']);

        $this->validate($album);
        return $album;
    }

	/**
	 * Update
	 *
	 * @param Song $song
	 * @param      $formData
	 * @return \JJ\MainBundle\Entity\Album
	 */
	public function update(Song $song, $formData)
	{
		// create new
		if (filter_var($formData['create'], FILTER_VALIDATE_BOOLEAN)) {
			// find such album
			$album = $this->findOneByNameAndArtist($formData['name'], $song->getArtist());
			if (!$album) {
				$album = new Album();
				$this->em->persist($album);
				$album->setName($formData['name']);
				$album->setArtist($song->getArtist());
			}
			// or create (if name&artist same then no effect)
			$song->setAlbum($album);
		}
		// rename current
		else {
			$album = $song->getAlbum();
			// rename existing
			if ($album) {
				$albumExist = $this->findOneByNameAndArtist($formData['name'], $song->getArtist());
				// clean rename
				if (!$albumExist) {
					$album->setName($formData['name']);
				}
				// conflict: have to change associations for all songs and albums
				else {
					$albumExist->setName($formData['name']);
					foreach ($album->getSongs() as $albumSong) {
						$albumSong->setAlbum($albumExist);
					}
					$album = $albumExist;
				}
			}
			// create new
			else {
				$album = $this->findOneByName($formData['name']);
				if (!$album) {
					$album = new Album();
					$this->em->persist($album);
					$album->setName($formData['name']);
					$album->setArtist($song->getArtist());
				}
				$song->setAlbum($album);
			}
		}

		$album->setSize(!(int)$formData['size'] ? null : (int)$formData['size']);
		$album->setYear(!(int)$formData['year'] ? null : (int)$formData['year']);

		$this->validate($album);
		$this->em->flush();
		$this->em->refresh($album);
		return $album;
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	// REPO
	//////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Find
	 *
	 * @param $id
	 * @return Album
	 */
	public function find($id)
	{
		return $this->repo->find($id);
	}

	/**
	 * Find all
	 *
	 * @return Album[]
	 */
	public function findAll()
	{
		return $this->repo->findAll();
	}

    /**
     * Find one by path
     *
     * @param $name
     * @return Album
     */
    public function findOneByName($name)
    {
        return $this->repo->findOneByName($name);
    }

	/**
	 * Find one by name and artist
	 *
	 * @param $name
	 * @param $artist
	 * @return Album
	 */
    public function findOneByNameAndArtist($name, $artist)
    {
	    $criteria = array(
		    'name' => $name,
		    'artist' => $artist
	    );
        return $this->repo->findOneBy($criteria);
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
