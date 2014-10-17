<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\SongManager;
use JJ\MainBundle\Manager\AlbumManager;
use JJ\MainBundle\Entity\Song;

/**
 * @Route("recommend")
 */
class RecommendController extends Controller
{
    /**
     * Get Song Manager
     *
     * @return SongManager
     */
    protected function getSongManager()
    {
        return $this->get('song.manager');
    }

    /**
     * Get Album Manager
     *
     * @return AlbumManager
     */
    protected function getAlbumManager()
    {
        return $this->get('album.manager');
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
     * @Route("", name="recommend")
     * @Method({"GET"})
     */
    public function recommendAction()
    {
        $avgPlayedAt = $this->getSongManager()->findAvgPlayedAt();
        $albums = $this->getAlbumManager()->findRemovable($avgPlayedAt);
        return $this->createJsonResponse(reset($albums));
    }
}
