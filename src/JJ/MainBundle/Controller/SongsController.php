<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\Serializer;

use JJ\MainBundle\Manager\SongManager;

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
     * @Route("/next", name="songs_next")
     * @Method({"post"})
     */
    public function songsAction()
    {
        $formData = $this->getRequest()->request->all();

        $songs = $this->getSongManager()->getNextTwo($formData['ids']);

        return $this->createJsonResponse($songs);
    }
}
