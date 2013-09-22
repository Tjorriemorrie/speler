<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\AlbumRepository;
use Symfony\Component\Validator\Validator;

use JJ\MainBundle\Entity\Album;


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

        $this->validate($album);
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
}
