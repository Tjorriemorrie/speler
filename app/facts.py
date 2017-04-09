from app import app
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
        'is_albums_complete',
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
                fact = {
                    'section': 'success',
                    'data': 'Enjoy the tunes',
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
        return {
            'album': album,
            'songs': album.songs,
        }
