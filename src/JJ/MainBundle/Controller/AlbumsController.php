<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\AlbumManager;
use JJ\MainBundle\Entity\Album;

/**
 * @Route("albums")
 */
class AlbumsController extends Controller
{
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
     * @Route("", name="albums_all")
     * @Method({"get"})
     */
    public function allAction()
    {
        $albums = $this->getAlbumManager()->findAll();
        return $this->createJsonResponse($albums);
    }
    
    /**
     * @Route("/count", name="albums_count")
     * @Method({"get"})
     */
    public function countAction()
    {
        $countAlbums = $this->getAlbumManager()->countAll();
        return new JsonResponse($countAlbums);
    }
}
