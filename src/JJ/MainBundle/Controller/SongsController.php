<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\SongManager;
use JJ\MainBundle\Entity\Song;
use JJ\MainBundle\Manager\RatingManager;
use JJ\MainBundle\Utility\Identifier;

/**
 * @Route("songs")
 */
class SongsController extends Controller
{
    /**
     * Get Email  Manager
     *
     * @return SongManager
     */
    protected function getSongManager()
    {
        return $this->get('song.manager');
    }

    /**
     * Create json response
     *
     * @param        $data
     * @param string $format
     * @return JsonResponse
     */
    protected function createJsonResponse($data, $format = 'json')
    {
        $response = new JsonResponse();

        /** @var Serializer $serializer */
        $serializer = $this->get('serializer');
        $ser = $serializer->serialize($data, $format);

        $response->setContent($ser);
        return $response;
    }

    /**
     * @Route("", name="songs_all")
     * @Method({"get"})
     */
    public function allAction()
    {
        $songs = $this->getSongManager()->findAll();
        return $this->createJsonResponse($songs);
    }

    /**
     * @Route("/next", name="songs_next")
     * @Method({"post"})
     */
    public function songsAction()
    {
	    set_time_limit(0);

        $formData = $this->getRequest()->request->all();

        $songs = $this->getSongManager()->getNextTwo($formData['ids']);

	    /** @var RatingManager $ratingMan */
	    $ratingMan = $this->get('rating.manager');

	    foreach ($songs as $song) {
	        $song->setMatches($ratingMan->findMatches($song));
	    }

        return $this->createJsonResponse($songs);
    }

    /**
     * @Route("/{id}/accrete", name="songs_accrete")
     * @Method({"get"})
     */
    public function accrete(Song $song)
    {
        $this->getSongManager()->accrete($song);

        return $this->createJsonResponse($song);
    }

    /**
     * @Route("/count", name="songs_count")
     * @Method({"get"})
     */
    public function countAction()
    {
        $countSongs = $this->getSongManager()->countAll();
        return new JsonResponse($countSongs);
    }

	/**
	 * @Route("/{id}", name="songs_update")
	 * @Method({"post"})
	 */
	public function updateAction(Song $song)
	{
		$formData = $this->getRequest()->request->all();

		$song = $this->getSongManager()->update($song, $formData);

		/** @var Identifier $identifier */
		$identifier = $this->get('identifier');
		$identifier->setId3($song);

		return $this->createJsonResponse($song);
	}
}
