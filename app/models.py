import sqlalchemy as sa
from app.database import Base


class User(Base):
    __tablename__ = 'users'
    id = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(50), unique=True)
    email = sa.Column(sa.String(120), unique=True)

    def __init__(self, name=None, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return '<User %r>' % (self.name)


class Song(Base):
    __tablename__ = 'songs'
    id = sa.Column(sa.Integer, primary_key=True)
    album_id = sa.Column(sa.Integer, sa.ForeignKey('albums.id'))
    artist_id = sa.Column(sa.Integer, sa.ForeignKey('artists.id'))
    path = sa.Column(sa.String(255), unique=True)
    name = sa.Column(sa.String(255))
    number = sa.Column(sa.Integer)
    played_at = sa.Column(sa.DateTime, server_default=sa.func.now())
    count_played = sa.Column(sa.Integer)
    priority = sa.Column(sa.Float)
    created_at = sa.Column(sa.DateTime, server_default=sa.func.now())
    updated_at = sa.Column(sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())

    def __init__(self, path):
        self.path = path


class Album(Base):
    __tablename__ = 'albums'
    id = sa.Column(sa.Integer, primary_key=True)
    songs = sa.orm.relationship('Song', backref="album")
    artist_id = sa.Column(sa.Integer, sa.ForeignKey('artists.id'))
    name = sa.Column(sa.String(255))
    size = sa.Column(sa.Integer)
    year = sa.Column(sa.Integer)
    count_songs = sa.Column(sa.Integer)
    count_played = sa.Column(sa.Integer)
    played_at = sa.Column(sa.DateTime, server_default=sa.func.now())
    created_at = sa.Column(sa.DateTime, server_default=sa.func.now())
    updated_at = sa.Column(sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())


class Artist(Base):
    __tablename__ = 'artists'
    id = sa.Column(sa.Integer, primary_key=True)
    songs = sa.orm.relationship('Song', backref="artist")
    albums = sa.orm.relationship('Album', backref="artist")
    name = sa.Column(sa.String(255))
    created_at = sa.Column(sa.DateTime, server_default=sa.func.now())
    updated_at = sa.Column(sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    count_songs = sa.Column(sa.Integer)
    count_albums = sa.Column(sa.Integer)
    count_played = sa.Column(sa.Integer)
    played_at = sa.Column(sa.DateTime, server_default=sa.func.now())

