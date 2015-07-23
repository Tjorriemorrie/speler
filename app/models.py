from app import app, db


class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_path = db.Column(db.String(255), unique=True)
    path_name = db.Column(db.String(255), unique=True)
    # info
    name = db.Column(db.String(255))
    number = db.Column(db.Integer)
    # album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    # artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    # plays
    played_at = db.Column(db.DateTime, server_default=db.func.now())
    count_played = db.Column(db.Integer)
    priority = db.Column(db.Float, server_default=u'0.5')
    # ratings
    rated_at = db.Column(db.DateTime, server_default=db.func.now())
    count_rated = db.Column(db.Integer)
    rating = db.Column(db.Float)
    ratings_winners = db.relationship('Rating', backref='song_winner', foreign_keys='Rating.song_winner_id')
    ratings_losers = db.relationship('Rating', backref='song_loser', foreign_keys='Rating.song_loser_id')
    # other
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, path):
        self.full_path = path
        self.path_name = path[len('/static/music/'):]

    def __json__(self):
        return ['id', 'path_name', 'full_path']


class Queue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), unique=True, nullable=False)
    song = db.relationship('Song', lazy='joined')
    type = db.Column(db.String(20), server_default=u'audio/mpeg')
    src = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, song):
        self.song = song
        self.src = song.full_path

    # def __json__(self):
    #     return ['song', 'src', 'type', 'created_at']


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_winner_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    song_loser_id = db.Column(db.Integer, db.ForeignKey('song.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, winner, loser):
        self.song_winner = winner
        self.song_loser = loser


# class Album(Base):
#     __tablename__ = 'albums'
#     id = db.Column(db.Integer, primary_key=True)
#     songs = db.relationship('Song', backref="album")
#     artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
#     name = db.Column(db.String(255))
#     size = db.Column(db.Integer)
#     year = db.Column(db.Integer)
#     count_songs = db.Column(db.Integer)
#     count_played = db.Column(db.Integer)
#     played_at = db.Column(db.DateTime, server_default=db.func.now())
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
#
#
# class Artist(Base):
#     __tablename__ = 'artists'
#     id = db.Column(db.Integer, primary_key=True)
#     songs = db.relationship('Song', backref="artist")
#     albums = db.relationship('Album', backref="artist")
#     name = db.Column(db.String(255))
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
#     count_songs = db.Column(db.Integer)
#     count_albums = db.Column(db.Integer)
#     count_played = db.Column(db.Integer)
#     played_at = db.Column(db.DateTime, server_default=db.func.now())
