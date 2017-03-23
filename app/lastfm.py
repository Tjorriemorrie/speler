from pylast import LastFMNetwork, SessionKeyGenerator
import shelve

from app import app


class LastFm:
    # You have to have your own unique two values for API_KEY and API_SECRET
    # Obtain yours from http://www.last.fm/api/account for Last.fm
    # API_KEY = '2b532992c84242d372f5c0044d6883e5'
    # API_SECRET = '3c6688ac84deda063a697f5662a93eb0'
    API_KEY = '8fc05a68240dadf4c2430392768053fe'
    API_SECRET = 'bc2d48b14f3e864c6a07bbb6f9a0b690'
    URL_AUTH = 'http://www.last.fm/api/auth/?api_key={}'.format(API_KEY)
    URL_CALLBACK = 'http%3A%2F%2F127.0.0.1%3A5656%2Flastfm%2Fcallback'

    network = None

    def __init__(self, token=''):
        """Always create network"""
        with shelve.open('lastfm') as db:
            session_key = db.get('session_key')

            self.network = LastFMNetwork(
                api_key=self.API_KEY,
                api_secret=self.API_SECRET,
                session_key=session_key,
                token=token
            )

            if token:
                app.logger.info('saving session key: {}'.format(self.network.session_key))
                db['session_key'] = self.network.session_key

    def scrobble(self, history):
        """Scrobble song to lastfm"""
        params = {
            'artist': history.song.artist.name,
            'album': history.song.album.name,
            'title': history.song.name,
            'track_number': history.song.track_number,
            'timestamp': int(history.played_at.timestamp()),
        }
        app.logger.info('scrobbling: {}'.format(params))
        self.network.scrobble(**params)