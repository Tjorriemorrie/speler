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
use JJ\MainBundle\Entity\Song;

/**
 * Artist
 *
 * @ORM\Table(name="s_artist")
 * @ORM\Entity(repositoryClass="JJ\MainBundle\Entity\ArtistRepository")
 * @Ser\ExclusionPolicy("all")
 */
class Artist
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
     * @ORM\OneToMany(targetEntity="JJ\MainBundle\Entity\Song", mappedBy="artist")
     */
    private $songs;

    /**
     * @var Album[]
     *
     * @ORM\OneToMany(targetEntity="JJ\MainBundle\Entity\Album", mappedBy="artist")
     */
    private $albums;


    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     * @Assert\NotBlank
     * @Ser\Expose()
     */
    private $name;


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
	 * @ORM\Column(name="count_songs", type="integer")
	 * @Assert\Range(min=0)
	 */
	private $countSongs;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="count_albums", type="integer")
	 * @Assert\Range(min=0)
	 */
	private $countAlbums;

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
	    $this->countSongs = 0;
	    $this->countAlbums = 0;
	    $this->countPlayed = 0;
	    $this->countRated = 0;
        $this->songs = new \Doctrine\Common\Collections\ArrayCollection();
        $this->albums = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Artist
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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Artist
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
     * @return Artist
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
     * @return Artist
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
     * Add albums
     *
     * @param \JJ\MainBundle\Entity\Album $albums
     * @return Artist
     */
    public function addAlbum(\JJ\MainBundle\Entity\Album $albums)
    {
        $this->albums[] = $albums;

        return $this;
    }

    /**
     * Remove albums
     *
     * @param \JJ\MainBundle\Entity\Album $albums
     */
    public function removeAlbum(\JJ\MainBundle\Entity\Album $albums)
    {
        $this->albums->removeElement($albums);
    }

    /**
     * Get albums
     *
     * @return Album[]
     */
    public function getAlbums()
    {
        return $this->albums;
    }

    /**
     * Set countSongs
     *
     * @param integer $countSongs
     * @return Artist
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
     * Set countAlbums
     *
     * @param integer $countAlbums
     * @return Artist
     */
    public function setCountAlbums($countAlbums)
    {
        $this->countAlbums = $countAlbums;

        return $this;
    }

    /**
     * Get countAlbums
     *
     * @return integer
     */
    public function getCountAlbums()
    {
        return $this->countAlbums;
    }

    /**
     * Set countPlayed
     *
     * @param integer $countPlayed
     * @return Artist
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
     * @return Artist
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
     * @return Artist
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
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

    /**
     * Set playedAt
     *
     * @param \DateTime $playedAt
     * @return Artist
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
}
