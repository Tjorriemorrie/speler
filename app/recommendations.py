from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from operator import attrgetter
import re
import requests
from statistics import pstdev, mean

from app import app, db
from app.models import Song, Album, Artist, Similar
from app.lastfm import LastFm


def update_song_similars(song, days=90):
    # return set if recent
    if song.similars:
        app.logger.info('{} has similars already'.format(song))
        similar = song.similars[0]
        if similar.scraped_at > datetime.now() - timedelta(days=days):
            app.logger.info('{} similars are recently scraped'.format(song))
            return song.similars

    # quit if already scraped 2 today
    # hours_ago = datetime.now() - timedelta(hours=8)
    # latest = Similar.query.filter(Similar.scraped_at >= hours_ago).all()
    # if len(latest) >= 20:
    #     raise Exception('already scraped {} today'.format(set([l.key for l in latest])))

    # scrape
    # clear existing
    if song.similars:
        song.similars = []
        db.session.commit()

    # scrape new
    lastfm = LastFm()
    result = lastfm.get_similar_tracks(song.artist.name, song.name)
    app.logger.info('scraped {} similar to {}'.format(len(result), song))

    # process
    for row in result:
        # app.logger.debug('row {}'.format(row))
        track = row.item
        artist = track.get_artist()
        album = track.get_album()
        # exclude missing meta
        if not artist or not album:
            app.logger.warn('Missing album/artist for {}'.format(track.get_name()))
            continue
        # create
        similar = Similar(
            song=song,
            artist_name=artist.get_name(),
            album_name=album.get_name(),
            track_name=track.get_name(),
            similarity=row.match,
        )
        db.session.add(similar)
        app.logger.info(similar)
    db.session.commit()
    return song.similars


class Recommendations:
    """Creates recommendations from LastFM via our ratings"""

    def run(self):
        """Runs recommendation process using similarity on tracks."""
        songs = Song.query.filter(
            Song.rating > 0.90,
            Song.count_rated > 3
        ).order_by(
            Song.rating.desc(),
            Song.count_played.desc(),
            Song.played_at.desc()
        ).all()
        app.logger.info('{} songs returned above 90% rated at least 3 times'.format(len(songs)))

        albums = {}
        for song in songs:
            similars = update_song_similars(song)
            for similar in similars:

                # exclude if in lib
                existing_album = Album.query.join(Artist).filter(
                    Album.name == similar.album_name,
                    Artist.name == similar.artist_name
                ).first()
                if existing_album:
                    # app.logger.info('Existing album {}'.format(existing_album.name))
                    continue

                try:
                    albums[similar.key]['songs'].add(similar.track_name)
                    albums[similar.key]['rating'] += song.rating * similar.similarity
                    albums[similar.key]['sources'].add(str(song))
                except KeyError:
                    albums[similar.key] = {
                        'artist': similar.artist_name,
                        'album': similar.album_name,
                        'songs': set([similar.track_name]),
                        'rating': song.rating,
                        'sources': set([])
                    }
                app.logger.debug('{:.0f} <= {}'.format(
                    albums[similar.key]['rating'], similar.key))

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
            app.logger.info('Details = {}'.format(albums[recommendation]))
            return recommendation
        return 'No recommendation found'

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
