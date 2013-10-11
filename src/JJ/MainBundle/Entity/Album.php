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
use JJ\MainBundle\Entity\Artist;

/**
 * Album
 *
 * @ORM\Table(name="s_album")
 * @ORM\Entity(repositoryClass="JJ\MainBundle\Entity\AlbumRepository")
 * @UniqueEntity({"artist", "name"})
 * @Ser\ExclusionPolicy("all")
 */
class Album
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
     * @var Song[]
     *
     * @ORM\OneToMany(targetEntity="JJ\MainBundle\Entity\Song", mappedBy="album")
     */
    private $songs;

    /**
     * @var Artist[]
     *
     * @ORM\ManyToOne(targetEntity="JJ\MainBundle\Entity\Artist", inversedBy="albums")
     * @Ser\Expose()
     */
    private $artist;


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
     * @ORM\Column(name="size", type="integer", nullable=true)
     * @Assert\Type("integer")
     * @Assert\Range(min=1)
     * @Ser\Expose()
     */
    private $size;

    /**
     * @var int
     *
     * @ORM\Column(name="year", type="integer", nullable=true)
     * @Assert\Type("integer")
     * @Assert\Range(min=1900, max=2020)
     * @Ser\Expose()
     */
    private $year;


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


    /**
     * @var int
     *
     * @Ser\Expose()
     * @Ser\Accessor(getter="countSongs")
     */
    private $countSongs;

    /**
     * @var int
     *
     * @Ser\Expose()
     * @Ser\Accessor(getter="countPlayed")
     */
    private $countPlayed;

    /**
     * @var \DateTime
     *
     * @Ser\Expose()
     * @Ser\Accessor(getter="getLastPlayedAt")
     */
    private $playedAt;

    ///////////////////////////////////////////////////////////////////////////////////////////
    // METHODS
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Count songs
     *
     * @return int
     */
    public function countSongs()
    {
        return $this->getSongs()->count();
    }

    /**
     * Get last played at
     *
     * @return \DateTime
     */
    public function getLastPlayedAt()
    {
        $criteria = Criteria::create()
            ->orderBy(array('playedAt' => Criteria::DESC))
            ->setMaxResults(1);
        /** @var Song $song */
        $song = $this->getSongs()->matching($criteria)->first();
	    if (!$song) {
		    return null;
	    } else {
            return $song->getPlayedAt();
	    }
    }

    /**
     * Count played
     *
     * @return int
     */
    public function countPlayed()
    {
        $count = 0;
        foreach ($this->getSongs() as $song) {
            $count += $song->getCountPlayed();
        }
        return $count;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // GETTERS AND SETTERS
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->songs = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * Set name
     *
     * @param string $name
     * @return Album
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
     * Set size
     *
     * @param integer $size
     * @return Album
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * Get size
     *
     * @return integer
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Album
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
     * @return Album
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
     * Add songs
     *
     * @param \JJ\MainBundle\Entity\Song $songs
     * @return Album
     */
    public function addSong(\JJ\MainBundle\Entity\Song $songs)
    {
        $this->songs[] = $songs;

        return $this;
    }

    /**
     * Remove songs
     *
     * @param \JJ\MainBundle\Entity\Song $songs
     */
    public function removeSong(\JJ\MainBundle\Entity\Song $songs)
    {
        $this->songs->removeElement($songs);
    }

    /**
     * Get songs
     *
     * @return Song[]
     */
    public function getSongs()
    {
        return $this->songs;
    }

    /**
     * Set artist
     *
     * @param \JJ\MainBundle\Entity\Artist $artist
     * @return Album
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

    /**
     * Set year
     *
     * @param integer $year
     * @return Album
     */
    public function setYear($year)
    {
        $this->year = $year;

        return $this;
    }

    /**
     * Get year
     *
     * @return integer
     */
    public function getYear()
    {
        return $this->year;
    }
}
