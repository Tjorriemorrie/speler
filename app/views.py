from app import app
from flask import request, render_template, Response
from app.models import Song, Queue, History, Artist, Album
from app.manager import scanDirectory, getSelections, addSongToQueue, createHistory, validateSongs, createRatings, parseId3Tags, setAlbumsSized, setArtist
from flask.ext.jsontools import jsonapi
# from lastfm import LastFm


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('base.html')


@app.route('/find/<grouping>')
@jsonapi
def findFiles(grouping):
    app.logger.info('grouping = {}'.format(grouping))

    if grouping == 'artists':
        items = Artist.query.filter(
            Artist.rating.isnot(None),
        ).order_by(
            Artist.rating.desc(),
            Artist.count_albums.desc(),
            Artist.count_songs.desc(),
        ).all()
    elif grouping == 'albums':
        items = Album.query.filter(
            Album.rating.isnot(None),
        ).order_by(
            Album.rating.desc(),
            Album.count_songs.desc(),
        ).all()
    elif grouping == 'songs':
        items = Song.query.order_by(
            Song.priority.desc(),
            Song.rating.desc(),
            Song.count_played.desc(),
            Song.updated_at.desc(),
            Song.path_name.asc(),
        ).all()
    else:
        items = []

    app.logger.info('{} items found for {}'.format(len(items), grouping))
    return items


@app.route('/scan/dir')
@jsonapi
def scanDir():
    lost_count = validateSongs()
    new_count = scanDirectory()
    parsed_count = parseId3Tags()
    return {
        'new': new_count,
        'lost': lost_count,
        'parsed': parsed_count,
    }


@app.route('/load/histories')
@jsonapi
def loadHistories():
    histories = History.query.order_by(History.played_at.desc()).limit(5).all()
    app.logger.info('{} histories songs found'.format(len(histories)))
    return histories


@app.route('/load/queue')
@jsonapi
def loadQueue():
    queues = Queue.query.order_by(Queue.created_at.asc()).all()
    app.logger.info('{} queue songs found'.format(len(queues)))
    return queues


@app.route('/add/queue', methods=['POST'])
@jsonapi
def addQueue():
    app.logger.info('Request form {}'.format(request.form))
    id = request.form.get('winner', 0, type=int)
    app.logger.info('Winner id {}'.format(id))
    song = Song.query.get_or_404(id)

    losers = request.form.getlist('losers[]')
    app.logger.info('Losers {}'.format(losers))
    ratings = createRatings(song, losers)

    queue = addSongToQueue(song)
    app.logger.info('Adding {} to queue'.format(queue))
    return queue


@app.route('/selection')
@jsonapi
def selection():
    selections = getSelections()
    return selections


@app.route('/ended', methods=['POST'])
@jsonapi
def ended():
    id = request.form.get('id', 0, type=int)
    queue = Queue.query.get_or_404(id)
    history = createHistory(queue)
    app.logger.info('Set {} as {}'.format(queue, history))
    return history


@app.route('/factoid/<section>', methods=['GET', 'POST'])
@jsonapi
def factoid(section):

    if request.method == 'GET':

        app.logger.info('factoid get with {}'.format(section))

        if section == 'is_logged_in':
            # lastfm = LastFm()
            return True

        elif section == 'is_parsed':
            cnt = Song.query.filter(
                Song.id3_parsed.is_(False)
            ).count()
            return {'count': cnt} if cnt else True

        elif section == 'is_albums_sized':
            album = Album.query.filter(
                Album.total_tracks.is_(None)
            ).first()
            return True if not album else album

        elif section == 'is_albums_complete':
            album = Album.query.filter(
                Album.total_tracks != Album.count_songs
            ).first()
            return True if not album else {
                'album': album,
                'songs': album.songs,
            }

        else:
            raise Exception('you want what? {}'.format(section))

    elif request.method == 'POST':

        app.logger.info('factoid post with {}'.format(section))
        form_data = request.form
        app.logger.debug(form_data)

        if section in ['is_albums_sized', 'is_albums_complete']:
            album = Album.query.get_or_404(form_data.get('album_id', 0))
            total_tracks = form_data.get('total_tracks', None)
            return setAlbumsSized(album, total_tracks)

        else:
            raise Exception('you want what? {}'.format(section))


@app.route('/set/<info>', methods=['GET', 'POST'])
@jsonapi
def setInfo(info):
    app.logger.info('set {}'.format(info))

    if request.method == 'POST':
        form_data = request.form
        app.logger.info(form_data)

        if info == 'artists':
            artist = Artist.query.get_or_404(form_data.get('id', 0))
            setArtist(artist, form_data.get('name', None))

        elif info == 'albums':
            raise Exception('unknown albums')

        elif info == 'songs':
            raise Exception('unknown songs')

        else:
            raise Exception('unknown info {}'.format(info))
