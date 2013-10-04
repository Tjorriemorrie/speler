<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\RatingManager;
use JJ\MainBundle\Entity\Rating;
use JJ\MainBundle\Entity\Song;

/**
 * @Route("ratings")
 */
class RatingsController extends Controller
{
    /**
     * Rating Manager
     *
     * @return RatingManager
     */
    protected function getRatingManager()
    {
        return $this->get('rating.manager');
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
     * @Route("/{id}", name="ratings_find")
     * @Method({"get"})
     */
    public function findAction(Song $song)
    {
        $ratings = $this->getRatingManager()->findMatches($song);
        return $this->createJsonResponse($ratings);
    }

	/**
	 * @Route("/{winner}/{loser}", name="ratings_match")
	 * @Method({"get"})
	 */
	public function matchAction(Song $winner, Song $loser)
	{
		$rating = $this->getRatingManager()->setMatch($winner, $loser);
		return $this->createJsonResponse($rating);
	}
}