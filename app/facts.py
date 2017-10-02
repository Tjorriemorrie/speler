import json
from datetime import datetime
from app import app, db
from sqlalchemy.sql import func
from app.models import Song, Album


class Factoid:
    """Create facts from current library state"""

    SECTIONS = [
        'id3_parsed',
        'is_songs_named',
        'is_songs_tracked',
        'is_songs_artist',
        'is_songs_album',
        'is_albums_sized',
        'is_albums_artist',
        'is_albums_complete',
        'is_albums_bad',
    ]

    def __init__(self, session):
        """provided dict is session holder"""
        self.session = session

    def next_fact(self):
        """Get next fact"""
        try:
            for section in self.SECTIONS:
                if section in self.session:
                    app.logger.debug('already searched {} for facts'.format(section))
                    continue
                data = getattr(self, section)()
                if data:
                    fact = {
                        'section': section,
                        'data': data,
                    }
                    break
                app.logger.debug('No more facts from {}'.format(section))
                self.session.append(section)
            else:
                app.logger.debug('No facts found in all sections')
                new = Song.query.filter(
                    Song.count_played == 0
                ).count()
                fact = {
                    'section': 'success',
                    'data': '{} new songs'.format(new) if new else 'Enjoy the tunes'
                }
        except Exception as e:
            fact = {
                'section': 'error',
                'data': '{}'.format(e),
            }
        app.logger.info('factoid: {}'.format(fact))
        return fact

    def id3_parsed(self):
        cnt = Song.query.filter(
            Song.id3_parsed.is_(False)
        ).count()
        return cnt

    def is_songs_named(self):
        song = Song.query.filter(
            Song.name.is_(None)
        ).first()
        return song

    def is_songs_tracked(self):
        song = Song.query.filter(
            Song.track_number.is_(None)
        ).first()
        return song

    def is_songs_artist(self):
        song = Song.query.filter(
            Song.artist_id.is_(None)
        ).first()
        return song

    def is_songs_album(self):
        song = Song.query.filter(
            Song.album_id.is_(None)
        ).first()
        return song

    def is_albums_artist(self):
        album = Album.query.filter(
            Album.artist_id.is_(None)
        ).first()
        return album

    def is_albums_sized(self):
        album = Album.query.filter(
            Album.total_tracks.is_(None)
        ).first()
        return album

    def is_albums_complete(self):
        album = Album.query.filter(
            Album.total_tracks != Album.count_songs
        ).first()

        if not album:
            return

        if self._delete_empty_album(album):
            return self.is_albums_complete()

        app.logger.info('incomplete album: name {}'.format(album.name))
        app.logger.info('incomplete album: count_songs {}'.format(album.count_songs))
        app.logger.info('incomplete album: len(songs) {}'.format(len(album.songs)))

        return {
            'album': album,
            'songs': album.songs,
        }

    def is_albums_bad(self):
        albums = Album.query.filter(
            Album.rating < 0.10
        ).order_by(
            Album.rating,
            Album.count_rated.desc()
        ).all()

        avg_played = Song.query.with_entities(
            func.avg(func.extract('epoch', Song.played_at))
        ).scalar()
        avg_played = datetime.fromtimestamp(int(avg_played))
        app.logger.info('AVG played {}'.format(avg_played))

        for album in albums:

            if self._delete_empty_album(album):
                continue

            # check if all songs on album has been rated (req to be sure it is bad)
            all_rated = True
            all_played = True
            all_played_after_avg = True
            all_badly_rated = True
            for song in album.songs:
                if song.count_rated < 3:
                    all_rated = False
                    app.logger.info('Not all songs rated 3x in {}'.format(album.name))
                    break
                if song.count_played < 1:
                    all_played = False
                    app.logger.info('Not all songs played 1x in {}'.format(album.name))
                    break
                if song.played_at > avg_played:
                    all_played_after_avg = False
                    app.logger.info('Not all songs played earlier than avg {}'.format(album.name))
                    break
                if song.rating > 0.50:
                    all_badly_rated = False
                    app.logger.info('Not all songs are badly rated {}'.format(album.name))
                    break

            if all_rated and all_played and all_played_after_avg and all_badly_rated:
                app.logger.info('bad album: {} {}'.format(album.artist.name, album.name))
                return {
                    'album': album,
                    'songs': album.songs,
                }
        return

    def _delete_empty_album(self, album):
        if not album.songs:
            app.logger.info('Deleting {} with no songs'.format(album.name))
            db.session.delete(album)
            db.session.commit()
            return True
        return False
