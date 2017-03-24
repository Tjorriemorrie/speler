from flask import request, render_template, Response, redirect
from flask.ext.jsontools import jsonapi

from app import app
from app.models import Song, Queue, History, Artist, Album
from app.manager import scanDirectory, getSelections, addSongToQueue, createHistory, validateSongs, createRatings, parseId3Tags, setArtist
from app.manager import setSongName, setSongTrackNumber, setSongArtist, setSongAlbum
from app.manager import setAlbumSize
from app.lastfm import LastFm


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    lastfm = LastFm()
    app.logger.info('LastFM session_key = {}'.format(lastfm.network.session_key))
    if not lastfm.network.session_key:
        app.logger.warn('authenticating with LastFM')
        return redirect('{}&cb={}'.format(lastfm.URL_AUTH, lastfm.URL_CALLBACK))
    return render_template('base.html')


@app.route('/lastfm/callback')
def lastfm_callback():
    token = request.args.get('token')
    app.logger.info('lastfm callback received with token: {}'.format(token))
    if not token:
        raise ValueError('Invalid token received')
    LastFm(token)
    return redirect('/')


@app.route('/find/<grouping>')
@jsonapi
def findFiles(grouping):
    app.logger.info('grouping = {}'.format(grouping))

    if grouping == 'artists':
        qry = Artist.query.filter(
            Artist.rating.isnot(None),
        )

    elif grouping == 'albums':
        qry = Album.query.filter(
            Album.rating.isnot(None),
        )

    elif grouping == 'songs':
        qry = Song.query

    else:
        return []

    rows = qry.all()

    return rows


@app.route('/scan/dir')
@jsonapi
def scanDir():
    res = {}
    res['lost'] = validateSongs()
    res['new'] = scanDirectory()
    return res


@app.route('/scan/id3')
@jsonapi
def scanId3():
    res = {}
    res['parsed'] = parseId3Tags()
    return res


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

    LastFm().show_some_love([song] + [r.song_loser for r in ratings])

    queue = addSongToQueue(song)
    queue = addSongToQueue()
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
    LastFm().scrobble(history)
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

        elif section == 'is_songs_named':
            song = Song.query.filter(
                Song.name.is_(None)
            ).first()
            return True if not song else song

        elif section == 'is_songs_tracked':
            song = Song.query.filter(
                Song.track_number.is_(None)
            ).first()
            return True if not song else song

        elif section == 'is_songs_artist':
            song = Song.query.filter(
                Song.artist_id.is_(None)
            ).first()
            return True if not song else song

        elif section == 'is_songs_album':
            song = Song.query.filter(
                Song.album_id.is_(None)
            ).first()
            return True if not song else song

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


@app.route('/set/<info>', methods=['POST'])
@jsonapi
def setInfo(info):
    app.logger.info('set {}'.format(info))

    form_data = request.form
    app.logger.info('form data: {}'.format(form_data))

    if info == 'artists':
        artist = Artist.query.get_or_404(form_data.get('id', 0))
        setArtist(artist, form_data.get('name', None))

    elif info == 'albums':
        album = Album.query.get_or_404(form_data.get('id', 0))
        if 'total_tracks' in form_data:
            setAlbumSize(album, form_data.get('total_tracks', None))
        return album

    elif info == 'songs':
        song = Song.query.get_or_404(form_data.get('id', 0))
        if 'name' in form_data:
            setSongName(song, form_data.get('name', None))
        if 'track_number' in form_data:
            setSongTrackNumber(song, form_data.get('track_number', None))
        if 'artist.name' in form_data:
            setSongArtist(song, form_data.get('artist.name', None))
        if 'album.name' in form_data:
            setSongAlbum(song, form_data.get('album.name', None))
        return song

    else:
        raise Exception('unknown info {}'.format(info))
