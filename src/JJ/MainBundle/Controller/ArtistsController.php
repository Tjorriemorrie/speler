<?php

namespace JJ\MainBundle\Controller;

use JJ\MainBundle\Entity\Song;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\ArtistManager;
use JJ\MainBundle\Entity\Artist;
use JJ\MainBundle\Utility\Identifier;

/**
 * @Route("artists")
 */
class ArtistsController extends Controller
{
    /**
     * Get Artist Manager
     *
     * @return ArtistManager
     */
    protected function getArtistManager()
    {
        return $this->get('artist.manager');
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
     * @Route("", name="artists_all")
     * @Method({"get"})
     */
    public function allAction()
    {
	    set_time_limit(0);
        $artists = $this->getArtistManager()->findAll();
        return $this->createJsonResponse($artists);
    }

    /**
     * @Route("/count", name="artists_count")
     * @Method({"get"})
     */
    public function countAction()
    {
        $countArtists = $this->getArtistManager()->countAll();
        return new JsonResponse($countArtists);
    }

	/**
	 * @Route("/update/{song}", requirements={"_format" = "json"}, name="artists_update")
	 * @Method({"post"})
	 */
	public function updateAction(Song $song)
	{
		set_time_limit(0);

		$formData = $this->getRequest()->request->all();

		$artist = $this->getArtistManager()->update($song, $formData);

		/** @var Identifier $identifier */
		$identifier = $this->get('identifier');
		foreach ($artist->getSongs() as $song) {
			$identifier->setId3($song);
		}

		return $this->createJsonResponse($artist);
	}
}
