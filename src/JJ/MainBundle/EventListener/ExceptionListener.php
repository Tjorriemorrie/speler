<?php

namespace JJ\MainBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $request = $event->getRequest();
        //die(var_dump($request));

        if ($request->getRequestFormat() !== 'json' && !$request->isXmlHttpRequest()) {
	        return;
        }

        //die(var_dump('request is format json'));

        $exception = $event->getException();

        $response = new JsonResponse(array(
	        'code' => $exception->getCode(),
	        'message' => $exception->getMessage(),
        ));

        // HttpExceptionInterface is a special type of exception that
        // holds status code and header details
        if ($exception instanceof HttpExceptionInterface) {
	        $response->setStatusCode($exception->getStatusCode());
	        $response->headers->replace($exception->getHeaders());
        } else {
	        $response->setStatusCode(500);
        }

        $event->setResponse($response);
    }
}
