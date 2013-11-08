<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\LastFmManager;
use JJ\MainBundle\Entity\Song;

/**
 * LastFm controller
 * @Route("/lastfm")
 */
class LastFmController extends Controller
{
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
	 * Get LastFm Manager
	 * @return LastFmManager
	 */
	protected function getLastFmManager()
	{
		return $this->get('lastfm.manager');
	}

	/**
	 * @Route("", name="lastfm")
	 */
	public function lastfmAction()
	{
		$lastfm = $this->getLastFmManager()->find(1);
		return $this->createJsonResponse($lastfm);
	}

	/**
     * @Route("/callback", name="lastfm_callback")
     */
    public function callbackAction(Request $request)
    {
        $token = $request->get('token');

        $this->getLastFmManager()->requestSession(1, $token);

        return $this->redirect($this->generateUrl('home'));
    }

    /**
     * @Route("/scrobble/{id}", defaults={"_format" = "json", "id" = null}, name="lastfm_scrobble")
     */
    public function scrobbleAction(Song $song)
    {
        $result = $this->getLastFmManager()->scrobble(1, $song);

        if ($result) {
            $result = $this->getLastFmManager()->love(1, $song);
        }

        return new JsonResponse('OK');
    }

    /**
     * @Route("/now/playing/{id}", defaults={"_format" = "json", "id" = null}, name="lastfm_now_playing")
     */
    public function nowPlayingAction(Song $song)
    {
        $result = $this->getLastFmManager()->nowPlaying(1, $song);

        return new JsonResponse('OK');
    }
}
