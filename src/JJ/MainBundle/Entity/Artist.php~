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
     * @Ser\Expose()
     * @Ser\Accessor(getter="countSongs")
     */
    private $countSongs;

    /**
     * @var int
     *
     * @Ser\Expose()
     * @Ser\Accessor(getter="countAlbums")
     */
    private $countAlbums;

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
     * Count albums
     *
     * @return int
     */
    public function countAlbums()
    {
        return $this->getAlbums()->count();
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
        return !$song ? null : $song->getPlayedAt();
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
}