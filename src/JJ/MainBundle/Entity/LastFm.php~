<?php

namespace JJ\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as Ser;

/**
 * @ORM\Table(name="s_lastfm")
 * @ORM\Entity
 * @UniqueEntity({"serviceSession"})
 * @Ser\ExclusionPolicy("all")
 */
class LastFm
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Ser\Expose()
     */
    protected $id;

    /**
     * @ORM\Column(name="screen_name", type="string", length=145, nullable=true)
     * @Assert\Length(min=1, max=145)
     * @Ser\Expose()
     */
    protected $screenName;

    /**
     * @ORM\Column(name="service_session", type="string", length=45, unique=true, nullable=true)
     * @Assert\Length(min=32, max=32)
     */
    protected $serviceSession;

    /**
     * @ORM\Column(name="authorised_at", type="datetime", nullable=true)
     * @Assert\DateTime()
     * @Ser\Expose()
     */
    protected $authorisedAt;

    /**
     * @ORM\Column(name="created_at", type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    protected $createdAt;

    /**
     * @ORM\Column(name="updated_at", type="datetime")
     * @Gedmo\Timestampable(on="update")
     */
    protected $updatedAt;

    //////////////////////////////////////////////////////////////////////////////////////
    // METHODS
    //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Get status
	 * @return bool
	 */
	public function getStatus()
	{
		return (bool)$this->authorisedAt;
	}

	//////////////////////////////////////////////////////////////////////////////////////
    // GETTERS & SETTERS
    //////////////////////////////////////////////////////////////////////////////////////



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set screenName
     *
     * @param string $screenName
     * @return LastFm
     */
    public function setScreenName($screenName)
    {
        $this->screenName = $screenName;

        return $this;
    }

    /**
     * Get screenName
     *
     * @return string
     */
    public function getScreenName()
    {
        return $this->screenName;
    }

    /**
     * Set serviceSession
     *
     * @param string $serviceSession
     * @return LastFm
     */
    public function setServiceSession($serviceSession)
    {
        $this->serviceSession = $serviceSession;

        return $this;
    }

    /**
     * Get serviceSession
     *
     * @return string
     */
    public function getServiceSession()
    {
        return $this->serviceSession;
    }

    /**
     * Set authorisedAt
     *
     * @param \DateTime $authorisedAt
     * @return LastFm
     */
    public function setAuthorisedAt($authorisedAt)
    {
        $this->authorisedAt = $authorisedAt;

        return $this;
    }

    /**
     * Get authorisedAt
     *
     * @return \DateTime
     */
    public function getAuthorisedAt()
    {
        return $this->authorisedAt;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return LastFm
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return LastFm
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}
