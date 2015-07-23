from app import app, db
from app.models import Song, Queue
import os
import random


def scanDirectory():
    app.logger.info('Scanning {}'.format(app.config['MUSIC_FOLDER']))

    # find new files
    new_paths = []
    for curdir, subdirs, files in os.walk(app.config['MUSIC_FOLDER']):
        for file_name in files:
            file_path = os.path.abspath(os.path.join(curdir, file_name))[9:]
            # app.logger.debug(file_path)

            if not Song.query.filter_by(full_path=file_path).first():
                new_paths.append(file_path)

    if new_paths:
        app.logger.info('Adding {} new files...'.format(len(new_paths)))
        for file_path in new_paths:
            song = Song(file_path)
            db.session.add(song)
            app.logger.debug('Adding {}'.format(file_path))
        app.logger.info('Comitting {} new files...'.format(len(new_paths)))
        db.session.commit()

    return len(new_paths)


def getSelections():
    app.logger.info('Fetching selections')
    selections = []
    used_ids = []

    # exclude songs from queue
    queues = Queue.query.all()
    app.logger.debug('{} in queue'.format(len(queues)))
    for queue in queues:
        used_ids.append(queue.song_id)
    app.logger.debug('Used ids: {}'.format(used_ids))

    for _ in range(5):

        # fetch highest priority songs
        songs_priority = Song.query.filter(Song.id.notin_(used_ids)).order_by(Song.priority.desc()).limit(2).all()
        app.logger.debug('{} in priority'.format(len(songs_priority)))
        for song in songs_priority:
            used_ids.append(song.id)

        # fetch last rated songs
        songs_rated = Song.query.filter(Song.id.notin_(used_ids)).order_by(Song.rated_at.asc()).limit(2).all()
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