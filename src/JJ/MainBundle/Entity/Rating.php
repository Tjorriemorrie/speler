<?php

namespace JJ\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Ser;
use Gedmo\Mapping\Annotation as Gedmo;

use JJ\MainBundle\Entity\Song;

/**
 * Rating
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="JJ\MainBundle\Entity\RatingRepository")
 * @Ser\ExclusionPolicy("all")
 */
class Rating
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Ser\Expose()
     */
    private $id;

    /**
     * @var Song
     *
     * @ORM\ManyToOne(targetEntity="JJ\MainBundle\Entity\Song", inversedBy="winners")
     * @Ser\Expose()
     */
    private $winner;

    /**
     * @var Song
     *
     * @ORM\ManyToOne(targetEntity="JJ\MainBundle\Entity\Song", inversedBy="losers")
     * @Ser\Expose()
     */
    private $loser;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="rated_at", type="datetime")
     * @Assert\DateTime
     * @Ser\Expose()
     */
    private $ratedAt;


    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     * @Gedmo\Timestampable(on="create")
     * @Assert\DateTime
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     * @Gedmo\Timestampable(on="update")
     * @Assert\DateTime
     */
    private $updatedAt;

    ///////////////////////////////////////////////////////////////////////////////////////////
    // METHODS
    ///////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////
    // GETTERS AND SETTERS
    ///////////////////////////////////////////////////////////////////////////////////////////


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
     * Set ratedAt
     *
     * @param \DateTime $ratedAt
     * @return Rating
     */
    public function setRatedAt($ratedAt)
    {
        $this->ratedAt = $ratedAt;
    
        return $this;
    }

    /**
     * Get ratedAt
     *
     * @return \DateTime 
     */
    public function getRatedAt()
    {
        return $this->ratedAt;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Rating
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
     * @return Rating
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

    /**
     * Set winner
     *
     * @param \JJ\MainBundle\Entity\Song $winner
     * @return Rating
     */
    public function setWinner(\JJ\MainBundle\Entity\Song $winner = null)
    {
        $this->winner = $winner;
    
        return $this;
    }

    /**
     * Get winner
     *
     * @return \JJ\MainBundle\Entity\Song 
     */
    public function getWinner()
    {
        return $this->winner;
    }

    /**
     * Set loser
     *
     * @param \JJ\MainBundle\Entity\Song $loser
     * @return Rating
     */
    public function setLoser(\JJ\MainBundle\Entity\Song $loser = null)
    {
        $this->loser = $loser;
    
        return $this;
    }

    /**
     * Get loser
     *
     * @return \JJ\MainBundle\Entity\Song 
     */
    public function getLoser()
    {
        return $this->loser;
    }
}