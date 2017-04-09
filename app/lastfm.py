from pylast import LastFMNetwork, SessionKeyGenerator
import shelve

from app import app, db


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
    LOVE_CUTOFF = 0.97

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

    def show_some_love(self, songs):
        """Sets track to love or not"""
        app.logger.info('showing some love for {} songs'.format(len(songs)))
        for song in songs:
            db.session.refresh(song)
            network_track = self.network.get_track(song.artist.name, song.name)
            is_loved = song.rating >= self.LOVE_CUTOFF
            app.logger.debug('[{:.0f}%] {} loving {}'.format(
                song.rating * 100, is_loved, network_track))
            if is_loved:
                network_track.love()
            else:
                network_track.unlove()
            # is_loved = network_track.get_userloved()
            # app.logger.debug('found network track {} loved {}'.format(network_track, is_loved))
            # if is_loved:
            #     if song.rating < self.LOVE_CUTOFF:
            #         app.logger.info('lost love {} [{:.0f}%]'.format(network_track, song.rating *
            #                                                        100))
            #         res = network_track.unlove()
            #         app.logger.debug(res)
            #     else:
            #         app.logger.info('still loving {} [{:.0f}%]'.format(network_track, song.rating *
            #                                                          100))
            # else:
            #     res = network_track.unlove()
            #     app.logger.debug(res)
            #     if song.rating >= self.LOVE_CUTOFF:
            #         app.logger.info('new love {} [{:.0f}%]'.format(network_track, song.rating *
            #                                                        100))
            #         res = network_track.love()
            #         app.logger.debug(res)
            #     else:
            #         app.logger.info('still no love for {} [{:.0f}%]'.format(network_track,
            #                                                              song.rating * 100))
