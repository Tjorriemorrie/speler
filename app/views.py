from flask import request, render_template, Response, redirect, session
from flask.ext.jsontools import jsonapi

from app import app
from app.facts import Factoid
from app.lastfm import LastFm
from app.manager import scanDirectory, getSelections, addSongToQueue, createHistory, validateSongs, createRatings, parseId3Tags, setArtistName
from app.manager import setSongName, setSongTrackNumber, setSongArtist, setSongAlbum
from app.manager import setAlbumSize, setAlbumName, setAlbumArtist
from app.models import Song, Queue, History, Artist, Album
from app.recommendations import Recommendations


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


@app.route('/factoid/<info>', methods=['POST'])
@jsonapi
def factoid_set(info):
    app.logger.info('set {}'.format(info))

    form_data = request.get_json()
    app.logger.info('form data: {}'.format(form_data))

    if info == 'artists':
        artist = Artist.query.get_or_404(form_data.get('id', 0))
        if 'name' in form_data:
            setArtistName(artist, form_data.get('name', None))
        else:
            raise ValueError('No artist key found to update')

    elif info == 'albums':
        album = Album.query.get_or_404(form_data.get('id', 0))
        if 'name' in form_data:
            album = setAlbumName(album, form_data['name'])
        elif 'total_tracks' in form_data:
            setAlbumSize(album, form_data['total_tracks'])
        elif 'artist.name' in form_data:
            setAlbumArtist(album, form_data['artist.name'])
        else:
            raise ValueError('No album key found to update')
        return album

    elif info == 'songs':
        song = Song.query.get_or_404(form_data.get('id', 0))
        if 'name' in form_data:
            setSongName(song, form_data.get('name', None))
        elif 'track_number' in form_data:
            setSongTrackNumber(song, form_data.get('track_number', None))
        elif 'artist.name' in form_data:
            setSongArtist(song, form_data.get('artist.name', None))
        elif 'album.name' in form_data:
            setSongAlbum(song, form_data.get('album.name', None))
        else:
            raise ValueError('No song key found to update')
        return song

    raise Exception('unknown info {}'.format(info))


@app.route('/factoid', methods=['GET'])
@jsonapi
def factoid():
    factoid_session = session.get('factoid', [])
    app.logger.info('factoid session = {}'.format(factoid_session))
    return Factoid(factoid_session).next_fact()


@app.route('/recommendations', methods=['GET'])
@jsonapi
def recommendations():
    recommendations = Recommendations().run()
    return recommendations

