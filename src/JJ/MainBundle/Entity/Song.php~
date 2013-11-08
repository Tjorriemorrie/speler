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
use JJ\MainBundle\Entity\Rating;

/**
 * Song
 *
 * @ORM\Table(name="s_song")
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
     * @ORM\Column(name="played_at", type="datetime", nullable=true)
     * @Assert\DateTime
     * @Ser\Expose()
     */
    private $playedAt;

    /**
     * @var int
     *
     * @ORM\Column(name="count_played", type="integer")
     * @Assert\Range(min=0)
     * @Ser\Expose()
     */
    private $countPlayed;


    /**
     * @var Rating[]
     *
     * @ORM\OneToMany(targetEntity="JJ\MainBundle\Entity\Rating", mappedBy="winner", cascade={"remove"})
     */
    private $winners;

    /**
     * @var Rating[]
     *
     * @ORM\OneToMany(targetEntity="JJ\MainBundle\Entity\Rating", mappedBy="loser", cascade={"remove"})
     */
    private $losers;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="rated_at", type="datetime", nullable=true)
	 * @Assert\DateTime
	 * @Ser\Expose()
	 */
	private $ratedAt;

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
	 * @ORM\Column(name="rating", type="float", nullable=true)
	 * @Assert\Range(min=0, max=1)
	 * @Ser\Expose()
	 */
	private $rating;


	/**
	 * @var float
	 *
	 * @ORM\Column(name="priority", type="float")
	 * @Assert\Range(min=-1, max=1)
	 * @Ser\Expose()
	 */
	private $priority;


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
	 * @var Song[]
	 *
	 * @Ser\Expose()
	 */
	private $matches;

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
        return file_exists($this->getAbsolutePath());
    }

	/**
	 * Get absolute path
	 * @return string
	 */
	public function getAbsolutePath()
	{
		return realpath(PATH_AUDIO . '/' . $this->getPath());
	}

	/**
	 * @param \JJ\MainBundle\Entity\Song[] $matches
	 */
	public function setMatches($matches)
	{
		$this->matches = $matches;
	}

	/**
	 * @return \JJ\MainBundle\Entity\Song[]
	 */
	public function getMatches()
	{
		return $this->matches;
	}

	/**
	 * Is mp3
	 * @return bool
	 */
	public function isMp3()
	{
		return strtolower($this->getExtension()) === 'mp3';
	}

	///////////////////////////////////////////////////////////////////////////////////////////
    // GETTERS AND SETTERS
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->winners = new \Doctrine\Common\Collections\ArrayCollection();
        $this->losers = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set playedAt
     *
     * @param \DateTime $playedAt
     * @return Song
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
     * Set countPlayed
     *
     * @param integer $countPlayed
     * @return Song
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
     * Set ratedAt
     *
     * @param \DateTime $ratedAt
     * @return Song
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
     * Set countRated
     *
     * @param integer $countRated
     * @return Song
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
     * Set priority
     *
     * @param float $priority
     * @return Song
     */
    public function setPriority($priority)
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * Get priority
     *
     * @return float
     */
    public function getPriority()
    {
        return $this->priority;
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
     * @param \DateTime $updatedAt
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
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
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

    /**
     * Add winners
     *
     * @param \JJ\MainBundle\Entity\Rating $winners
     * @return Song
     */
    public function addWinner(\JJ\MainBundle\Entity\Rating $winners)
    {
        $this->winners[] = $winners;

        return $this;
    }

    /**
     * Remove winners
     *
     * @param \JJ\MainBundle\Entity\Rating $winners
     */
    public function removeWinner(\JJ\MainBundle\Entity\Rating $winners)
    {
        $this->winners->removeElement($winners);
    }

    /**
     * Get winners
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getWinners()
    {
        return $this->winners;
    }

    /**
     * Add losers
     *
     * @param \JJ\MainBundle\Entity\Rating $losers
     * @return Song
     */
    public function addLoser(\JJ\MainBundle\Entity\Rating $losers)
    {
        $this->losers[] = $losers;

        return $this;
    }

    /**
     * Remove losers
     *
     * @param \JJ\MainBundle\Entity\Rating $losers
     */
    public function removeLoser(\JJ\MainBundle\Entity\Rating $losers)
    {
        $this->losers->removeElement($losers);
    }

    /**
     * Get losers
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getLosers()
    {
        return $this->losers;
    }

    /**
     * Set rating
     *
     * @param float $rating
     * @return Song
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
}
