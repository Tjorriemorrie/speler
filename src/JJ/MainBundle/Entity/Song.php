<?php

namespace JJ\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Ser;
use Gedmo\Mapping\Annotation as Gedmo;

use JJ\MainBundle\Entity\Album;
use JJ\MainBundle\Entity\Artist;

/**
 * Song
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="JJ\MainBundle\Entity\SongRepository")
 * @Ser\ExclusionPolicy("all")
 */
class Song
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
     * @var Album
     *
     * @ORM\ManyToOne(targetEntity="JJ\MainBundle\Entity\Album", inversedBy="songs")
     * @Ser\Expose()
     */
    private $album;

    /**
     * @var Artist
     *
     * @ORM\ManyToOne(targetEntity="JJ\MainBundle\Entity\Artist", inversedBy="songs")
     * @Ser\Expose()
     */
    private $artist;


    /**
     * @var string
     *
     * @ORM\Column(name="path", type="string", length=255, unique=true)
     * @Assert\NotBlank
     * @Ser\Expose()
     */
    private $path;

    /**
     * @var string
     *
     * @ORM\Column(name="extension", type="string", length=255)
     * @Assert\NotBlank
     * @Ser\Expose()
     */
    private $extension;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank
     * @Ser\Expose()
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="number", type="integer", nullable=true)
     * @Assert\Type("integer")
     * @Ser\Expose()
     */
    private $number;

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

    /**
     * File exists
     *
     * @return bool
     */
    public function fileExists()
    {
        return file_exists(PATH_AUDIO . DIRECTORY_SEPARATOR . $this->getPath());
    }

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
     * Set path
     *
     * @param string $path
     * @return Song
     */
    public function setPath($path)
    {
        $this->path = $path;
    
        return $this;
    }

    /**
     * Get path
     *
     * @return string 
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return Song
     */
    public function setExtension($extension)
    {
        $this->extension = $extension;
    
        return $this;
    }

    /**
     * Get extension
     *
     * @return string 
     */
    public function getExtension()
    {
        return $this->extension;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Song
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
     * @param string $updatedAt
     * @return Song
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return string 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Song
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set number
     *
     * @param integer $number
     * @return Song
     */
    public function setNumber($number)
    {
        $this->number = $number;
    
        return $this;
    }

    /**
     * Get number
     *
     * @return integer 
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * Set album
     *
     * @param \JJ\MainBundle\Entity\Album $album
     * @return Song
     */
    public function setAlbum(\JJ\MainBundle\Entity\Album $album = null)
    {
        $this->album = $album;
    
        return $this;
    }

    /**
     * Get album
     *
     * @return \JJ\MainBundle\Entity\Album 
     */
    public function getAlbum()
    {
        return $this->album;
    }

    /**
     * Set artist
     *
     * @param \JJ\MainBundle\Entity\Artist $artist
     * @return Song
     */
    public function setArtist(\JJ\MainBundle\Entity\Artist $artist = null)
    {
        $this->artist = $artist;
    
        return $this;
    }

    /**
     * Get artist
     *
     * @return \JJ\MainBundle\Entity\Artist 
     */
    public function getArtist()
    {
        return $this->artist;
    }
}
