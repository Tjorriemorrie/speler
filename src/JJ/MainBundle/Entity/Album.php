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
	 * @var int
	 *
	 * @ORM\Column(name="count_songs", type="integer")
	 * @Assert\Range(min=0)
     * @Ser\Expose()
	 */
	private $countSongs;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="count_played", type="integer")
	 * @Assert\Range(min=0)
	 * @Ser\Expose()
	 */
	private $countPlayed;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="count_rated", type="integer")
	 * @Assert\Range(min=0)
	 * @Ser\Expose()
	 */
	private $countRated;

	/**
	 * @var float
	 *
	 * @ORM\Column(name="rating", type="decimal", scale=14, precision=18, nullable=true)
	 * @Assert\Range(min=0)
	 * @Ser\Expose()
	 */
	private $rating;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="playedAt", type="datetime", nullable=true)
	 * @Assert\DateTime()
	 */
	private $playedAt;


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
     * Constructor
     */
    public function __construct()
    {
	    $this->countPlayed = 0;
	    $this->countSongs = 0;
	    $this->countRated = 0;
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

    /**
     * Set countSongs
     *
     * @param integer $countSongs
     * @return Album
     */
    public function setCountSongs($countSongs)
    {
        $this->countSongs = $countSongs;

        return $this;
    }

    /**
     * Get countSongs
     *
     * @return integer
     */
    public function getCountSongs()
    {
        return $this->countSongs;
    }

    /**
     * Set countPlayed
     *
     * @param integer $countPlayed
     * @return Album
     */
    public function setCountPlayed($countPlayed)
    {
        $this->countPlayed = $countPlayed;

        return $this;
    }

    /**
     * Get countPlayed
     *
     * @return integer
     */
    public function getCountPlayed()
    {
        return $this->countPlayed;
    }

    /**
     * Set countRated
     *
     * @param integer $countRated
     * @return Album
     */
    public function setCountRated($countRated)
    {
        $this->countRated = $countRated;

        return $this;
    }

    /**
     * Get countRated
     *
     * @return integer
     */
    public function getCountRated()
    {
        return $this->countRated;
    }

    /**
     * Set rating
     *
     * @param float $rating
     * @return Album
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * Set playedAt
     *
     * @param \DateTime $playedAt
     * @return Album
     */
    public function setPlayedAt($playedAt)
    {
        $this->playedAt = $playedAt;

        return $this;
    }

    /**
     * Get playedAt
     *
     * @return \DateTime
     */
    public function getPlayedAt()
    {
        return $this->playedAt;
    }

    /**
     * Get rating
     *
     * @return float
     */
    public function getRating()
    {
        return $this->rating;
    }
}
