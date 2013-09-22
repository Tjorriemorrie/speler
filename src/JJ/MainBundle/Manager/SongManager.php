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

        $song->setName($id3['trackName']);
        $song->setNumber($id3['trackNumber']);

        if (!$song->getName()) {
            $song->setName($file->getBasename());
        }

        $this->validate($song);
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
}
