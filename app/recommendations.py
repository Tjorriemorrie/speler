from bs4 import BeautifulSoup
from operator import attrgetter
import re
import requests
from statistics import pstdev, mean

from app import app
from app.models import Song, Album, Artist
from app.lastfm import LastFm


class Recommendations:
    """Creates recommendations from LastFM via our ratings"""

    def __init__(self):
        self.lastfm = LastFm()

    def run(self):
        """Runs recommendation process using similarity on tracks."""
        songs = Song.query.filter(
            Song.rating > 0.90,
            Song.count_rated > 3
        ).order_by(
            Song.rating.desc(),
            Song.count_played.desc()
        ).all()
        app.logger.info('{} songs returned above 90% rated at least 3 times'.format(len(songs)))

        albums = {}
        for song in songs:
            song.similar = self.lastfm.get_similar_tracks(song.artist.name, song.name)
            for similar in song.similar:
                app.logger.debug('similar {}'.format(similar))
                track = similar.item
                artist = track.get_artist()
                album = track.get_album()
                if not artist or not album:
                    app.logger.warn('Missing album/artist for {}'.format(track.get_name()))
                    continue
                app.logger.info('{:.0f}% -> {} - {} - {}'.format(
                    similar.match * 100, artist.get_name(), album.get_name(), track.get_name()))
                existing_album = Album.query.join(Artist).filter(
                    Album.name == album.get_name(),
                    Artist.name == artist.get_name()
                ).first()
                if existing_album:
                    app.logger.info('x -> {}'.format(existing_album.name))
                    continue
                key = '{}_{}'.format(artist.get_name(), album.get_name())
                try:
                    albums[key]['songs'].add(track.get_name())
                    albums[key]['rating'] += similar.match * song.rating
                    albums[key]['rating'] /= 2
                except KeyError:
                    albums[key] = {
                        'artist': artist.get_name(),
                        'album': album.get_name(),
                        'songs': set([track.get_name()]),
                        'rating': similar.match * song.rating,
                    }
                app.logger.debug('{:.0f}% <= {}'.format(albums[key]['rating'] * 100, key))

            ratings = [a['rating'] for a in albums.values()]
            mu = mean(ratings)
            st = pstdev(ratings, mu)
            st3 = mu + st * 3
            app.logger.debug('mu = {} and st = {} and st3 = {}'.format(mu, st, st3))

            albums_best = {k: v for k, v in albums.items() if v['rating'] >= st3}
            if not albums_best:
                app.logger.debug('No album above st3')
                continue

            recommendation = max(albums_best, key=lambda i: albums_best[i]['rating'])
            app.logger.info('Recommendation = {}'.format(recommendation))
            return recommendation

    # todo deprecated
    def scrape_top_users(self, artist):
        """Scrape top users of artist from lastfm"""
        app.logger.info('scraping user for {}'.format(artist))
        url = 'https://www.last.fm/music/{}/+listeners'.format(artist.name)
        app.logger.info('url: {}'.format(url))
        res = requests.get(url)

        soup = BeautifulSoup(res.text, 'html.parser')
        user_list_items = soup.find_all('li', class_='user-list-item')
        app.logger.debug('Found {} listeners'.format(len(user_list_items)))

        user_names = []
        for user_item in user_list_items:
            user_name = user_item.find('a').text
            app.logger.debug('Found user name: {}'.format(user_name))
            user_names.append(user_name)
        app.logger.debug('Found {} user names'.format(len(user_names)))
        return user_names
