from app import app
from app.database import db_session
from app.models import Song, Album, Artist
import os


def scanDirectory():
    app.logger.info('Scanning {}'.format(app.config['MUSIC_FOLDER']))
    for curdir, subdirs, files in os.walk(app.config['MUSIC_FOLDER']):
        for file_name in files:
            file_path = os.path.abspath(os.path.join(curdir, file_name))[9:]
            # app.logger.debug(file_path)

            if not Song.query.filter_by(path=file_path).first():
                song = Song(file_path)
                db_session.add(song)
                app.logger.debug('Adding {}'.format(file_path))

    app.logger.info('Committing new files...')
    db_session.commit()
