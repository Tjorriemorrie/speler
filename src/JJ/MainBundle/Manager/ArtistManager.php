<?php

namespace JJ\MainBundle\Manager;

use Doctrine\ORM\EntityManager;
use JJ\MainBundle\Entity\ArtistRepository;
use Symfony\Component\Validator\Validator;

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
