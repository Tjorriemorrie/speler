<?php

namespace JJ\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;

use JJ\MainBundle\Utility\Scanner;

/**
 * @Route("scan")
 */
class ScanController extends Controller
{
    /**
     * @Route("", name="scan")
     * @Template()
     */
    public function scanAction()
    {
	    set_time_limit(0);

        /** @var Scanner $scanner */
        $scanner = $this->get('scanner');
        $scanner->run();

        return new JsonResponse('OK');
    }
}
