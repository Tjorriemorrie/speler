from app import app, db
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
import datetime


class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    abs_path = db.Column(db.String(255), unique=True)
    web_path = db.Column(db.String(255), unique=True)
    path_name = db.Column(db.String(255), unique=True)

    # info
    id3_parsed = db.Column(db.Boolean, server_default=u'false')
    name = db.Column(db.String(255))
    track_number = db.Column(db.Integer)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'))
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))

    # plays
    queue = db.relation('Queue', cascade="all,delete-orphan", backref='song')
    count_played = db.Column(db.Integer, server_default=u'0', nullable=False)
    played_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    histories = db.relationship('History', cascade="all, delete-orphan", backref='song')

    # ratings
    ratings_winners = db.relationship('Rating', backref='song_winner', cascade="all,delete-orphan",
                                      foreign_keys='Rating.song_winner_id')
    ratings_losers = db.relationship('Rating', backref='song_loser', cascade="all,delete-orphan",
                                     foreign_keys='Rating.song_loser_id')
    rated_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    count_rated = db.Column(db.Integer, server_default=u'0', nullable=False)
    rating = db.Column(db.Float, default=0.5, nullable=False)

    # similars
    similars = db.relationship('Similar', backref='song', cascade="all,delete-orphan")

    # other
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, path):
        self.abs_path = path
        self.web_path = path[9:]
        self.path_name = self.web_path[len('/static/music/'):]
        self.similar = []

    @hybrid_property
    def time_since_played(self):
        return (datetime.datetime.now() - self.played_at).days

    @time_since_played.expression
    def time_since_played(cls):
        return db.func.cast(
            db.func.extract(db.text('DAY'), db.func.now() - cls.played_at),
            db.Float)

    @hybrid_property
    def max_played(self):
        return max(self.count_played, 1)

    @max_played.expression
    def max_played(cls):
        return db.func.cast(
            db.select([
                db.func.greatest(db.func.max(cls.count_played), 1)
            ]).label('max_played'),
            db.Float)

    @hybrid_property
    def priority(self):
        return self.rating - (
            self.count_played / self.max_played
        ) + (
            self.time_since_played / app.config['AVG_DAYS_LAST_PLAYED']
        )

    @priority.expression
    def priority(cls):
        return cls.rating - (cls.count_played / cls.max_played) + (cls.time_since_played / app.config['AVG_DAYS_LAST_PLAYED'])

    def __json__(self):
        return [
            'id', 'path_name', 'web_path',
            'name', 'track_number',
            'count_played', 'count_rated', 'rating',
            'priority', 'played_at',
            'artist', 'album'
        ]

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)

    def __str__(self):
        return '{} - {} - {}'.format(
            self.artist and self.artist.name or 'arty',
            self.album and self.album.name or 'alby',
            self.name)


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    name_id = db.Column(db.String(255), nullable=False)
    total_tracks = db.Column(db.Integer)
    year = db.Column(db.Integer)
    disc_number = db.Column(db.Integer, server_default=u'1')
    total_discs = db.Column(db.Integer, server_default=u'1')

    songs = db.relationship('Song', backref='album')

    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))

    count_songs = db.Column(db.Integer)
    count_played = db.Column(db.Integer)
    played_at = db.Column(db.DateTime, server_default=db.func.now())
    count_rated = db.Column(db.Integer)
    rated_at = db.Column(db.DateTime, server_default=db.func.now())
    rating = db.Column(db.Float)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, name, artist):
        self.name = name
        self.name_id = name.lower().strip()
        self.artist = artist

    def __json__(self):
        return [
            'id', 'name', 'total_tracks', 'disc_number', 'year',
            'artist', 'count_songs',
            'count_played', 'played_at',
            'count_rated', 'rated_at', 'rating',
        ]

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)


class Artist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    name_id = db.Column(db.String(255), unique=True)

    songs = db.relationship('Song', backref='artist')
    albums = db.relationship('Album', backref='artist')

    count_songs = db.Column(db.Integer)
    count_albums = db.Column(db.Integer)
    count_played = db.Column(db.Integer)
    played_at = db.Column(db.DateTime, server_default=db.func.now())
    count_rated = db.Column(db.Integer)
    rated_at = db.Column(db.DateTime, server_default=db.func.now())
    rating = db.Column(db.Float)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, name):
        self.name = name
        self.name_id = name.lower().strip()

    def __json__(self):
        return [
            'id', 'name',
            'count_songs', 'count_albums',
            'count_played', 'played_at',
            'count_rated', 'rated_at', 'rating',
        ]

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)


class Queue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), unique=True, nullable=False)
    src = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, song):
        self.song = song
        self.src = song.web_path

    def __json__(self):
        return ['id', 'song', 'src']

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)
    played_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, song):
        self.song = song

    def __json__(self):
        return ['id', 'song', 'played_at']

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_winner_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    song_loser_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    rated_at = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, winner, loser):
        self.song_winner = winner
        self.song_loser = loser

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__, self.id)


class Similar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    artist_name = db.Column(db.String(255))
    album_name = db.Column(db.String(255))
    track_name = db.Column(db.String(255))
    similarity = db.Column(db.Float)
    scraped_at = db.Column(db.DateTime, server_default=db.func.now())

    @property
    def key(self):
        return '{}_{}'.format(self.artist_name, self.album_name)

    def __repr__(self):
        return '<{} {} {} {}>'.format(
            self.__class__.__name__, self.id, self.artist_name, self.album_name)
