import os
import random
from app import app, db
from app.models import Song, Queue, History, Rating, Artist, Album
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4


def scanDirectory():
    app.logger.info('Scanning {}'.format(app.config['MUSIC_FOLDER']))

    # find new files
    new_paths = []
    for curdir, subdirs, files in os.walk(app.config['MUSIC_FOLDER']):
        for file_name in files:
            file_path = os.path.abspath(os.path.join(curdir, file_name))
            # app.logger.debug(file_path)

            if not Song.query.filter_by(abs_path=file_path).first():
                new_paths.append(file_path)

    if new_paths:
        for file_path in new_paths:
            song = Song(file_path)
            db.session.add(song)
            # app.logger.debug('Adding {}'.format(file_path))
        app.logger.info('Committing {} new files...'.format(len(new_paths)))
        db.session.commit()

    app.logger.info('{} songs added...'.format(len(new_paths)))
    return len(new_paths)


def validateSongs():
    app.logger.info('Validating songs')
    songs = Song.query.all()
    lost_songs = []
    for song in songs:
        if not os.path.isfile(song.abs_path):
            # app.logger.warn('Song not found', song)
            lost_songs.append(song)

    if lost_songs:
        for song in lost_songs:
            db.session.delete(song)
        app.logger.info('Committing {} lost files...'.format(len(lost_songs)))
        db.session.commit()

    app.logger.info('{} songs lost'.format(len(lost_songs)))
    return len(lost_songs)


def parseId3Tags():
    app.logger.info('Parsing ID3 tags...')
    songs = Song.query.filter(Song.id3_parsed.is_(False)).limit(100).all()
    app.logger.info('{} songs found to parse...'.format(len(songs)))

    # app.logger.info(EasyID3.valid_keys.keys())
    # app.logger.info(EasyMP4Tags.List)
    for song in songs:

        # get tag info
        info = {}
        if song.path_name.lower().endswith('mp3'):
            meta = MP3(song.abs_path)
            # app.logger.debug(meta.tags)
            info['song_title'] = meta.tags['TIT2'].text[0]
            info['track_number'] = int(meta.tags['TRCK'].text[0].split('/')[0])
            info['total_tracks'] = int(meta.tags['TRCK'].text[0].split('/')[1]) if '/' in meta.tags['TRCK'].text[0] else None
            info['artist_name'] = meta.tags['TPE1'].text[0]
            info['album_name'] = meta.tags['TALB'].text[0]
            info['disc_number'] = int(meta.tags['TPOS'].text[0].split('/')[0]) if 'TPOS' in meta else 1
            info['total_discs'] = int(meta.tags['TPOS'].text[0].split('/')[1]) if 'TPOS' in meta and '/' in meta.tags['TPOS'].text[0] else 1
            info['year'] = int(meta.tags['TDRC'].text[0].year) if 'TDRC' in meta else None
        elif song.path_name.lower().endswith('m4a'):
            meta = MP4(song.abs_path)
            info['song_title'] = meta[u'\xa9nam'][0]
            info['track_number'] = int(meta[u'trkn'][0][0])
            info['total_tracks'] = int(meta[u'trkn'][0][1])
            info['artist_name'] = meta[u'\xa9ART'][0]
            info['album_name'] = meta[u'\xa9alb'][0]
            info['disc_number'] = int(meta[u'disk'][0][0]) if u'disk' in meta else 1
            info['total_discs'] = int(meta[u'disk'][0][1]) if u'disk' in meta else 1
            info['year'] = int(meta[u'\xa9day'][0]) if u'\xa9day' in meta else None
        else:
            raise Exception('Unknown extension {}'.format(song.path_name))
        app.logger.debug(info)

        # artist info
        artist = Artist.query.filter_by(name=info['artist_name']).first()
        if not artist:
            artist = Artist(info['artist_name'])
            db.session.add(artist)
            db.session.commit()
            app.logger.info('{} <= {}'.format(artist, info['artist_name']))
        song.artist = artist

        # album info
        album = Album.query.filter_by(name=info['album_name'], artist=artist).first()
        if not album:
            album = Album(info['album_name'], artist)
            album.disc_number = info['disc_number']
            album.total_discs = info['total_discs']
            album.total_tracks = info['total_tracks']
            album.year = info['year']
            db.session.add(album)
            db.session.commit()
            app.logger.info('{} <= {}'.format(album, info['album_name']))
        song.album = album

        # song info
        song.name = info['song_title']
        song.number = info['track_number']
        song.id3_parsed = True

    db.session.commit()

    app.logger.info('Parsed {} ID3 tags...'.format(len(songs)))
    return len(songs)


def getSelections():
    app.logger.info('Fetching selections')
    n = 6
    m = 3
    selections = []
    used_ids = []

    # exclude songs from queue
    queues = Queue.query.all()
    app.logger.debug('{} in queue'.format(len(queues)))
    for queue in queues:
        used_ids.append(queue.song_id)
    app.logger.debug('Used ids: {}'.format(used_ids))

    # first play unrated songs
    songs = Song.query.filter(Song.count_rated==0).all()
    if len(songs) > m * n:
        for _ in range(n):
            selection = []
            for i in range(m):
                song_random = random.choice(songs)
                while song_random.id in used_ids:
                    song_random = random.choice(songs)
                selection.append(song_random)
                used_ids.append(song_random.id)
            selections.append(selection)

    # else get prioritised ratings
    else:
        raise Exception('all rated')
        for _ in range(n):

            # fetch highest priority songs
            songs_priority = Song.query.filter(Song.id.notin_(used_ids)).order_by(
                Song.priority.desc(),
                Song.played_at.asc(),
                Song.rated_at.asc(),
                Song.path_name.asc(),
            ).limit(2).all()
            app.logger.debug('{} in priority'.format(len(songs_priority)))
            for song in songs_priority:
                used_ids.append(song.id)

            # fetch last rated songs
            songs_rated = Song.query.filter(Song.id.notin_(used_ids)).order_by(
                Song.rated_at.asc(),
                Song.priority.asc(),
                Song.path_name.asc(),
            ).limit(2).all()
            app.logger.debug('{} in rated'.format(len(songs_rated)))
            for song in songs_rated:
                used_ids.append(song.id)

            if len(songs_priority) < 2 or len(songs_rated) < 2:
                app.logger.debug('Not enough songs')
                return selections

            selection = songs_priority + songs_rated
            app.logger.debug('Selection: {}'.format(selection))

            app.logger.debug('Used ids: {}'.format(used_ids))
            selections.append(selection)

    return selections


def addSongToQueue(song):
    app.logger.info('Adding song to queue {}'.format(song))
    queue = Queue(song)
    db.session.add(queue)
    db.session.commit()
    return queue


def createHistory(queue):
    app.logger.info('Creating history')

    # remove from queue
    db.session.delete(queue)

    # create history
    history = History(queue.song)
    db.session.add(history)

    db.session.commit()

    return history


def createRatings(winner_song, loser_ids):
    app.logger.info('Creating ratings...')
    ratings = []
    for loser_id in [i for i in map(int, loser_ids) if i != winner_song.id]:
        loser_song = Song.query.get(loser_id)
        app.logger.info('Rating: winner {} loser {}'.format(winner_song.id, loser_song.id))
        rating = Rating(winner_song, loser_song)
        ratings.append(rating)

    if ratings:
        for rating in ratings:
            db.session.add(rating)
        db.session.commit()

    app.logger.info('{} ratings'.format(len(ratings)))
    return ratings