from flask import redirect, render_template, request, session
from flask.ext.jsontools import jsonapi

from app import app
from app.facts import Factoid
from app.lastfm import LastFm
from app.manager import create_history, get_match, get_recent_history, get_song, parseId3Tags, \
    scanDirectory, setAlbumArtist, setAlbumName, setAlbumSize, setArtistName, setSongAlbum, \
    setSongArtist, setSongName, setSongTrackNumber, set_match_result, validateSongs
from app.models import Album, Artist, Song
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


#########################################################################################
# SONG
#########################################################################################

@app.route('/song/load')
@jsonapi
def load_song():
    return get_song()


@app.route('/song/ended', methods=['POST'])
@jsonapi
def ended_song():
    id = request.form.get('id', 0, type=int)
    song = Song.query.get_or_404(id)
    history = create_history(song)
    app.logger.info('Set {} as {}'.format(song, history))
    LastFm().scrobble(history)
    return history


#########################################################################################
# HISTORIES
#########################################################################################

@app.route('/histories/load')
@jsonapi
def load_histories():
    return get_recent_history()


#########################################################################################
# MATCH
#########################################################################################

@app.route('/match/load', methods=['POST'])
@jsonapi
def load_match():
    id = request.form.get('id', 0, type=int)
    song = Song.query.get_or_404(id)
    match = get_match(song)
    app.logger.info('Match: {}'.format(match))
    return match


@app.route('/match/set', methods=['POST'])
@jsonapi
def set_match():
    app.logger.info('Request form {}'.format(request.form))
    id = request.form.get('winner', 0, type=int)
    app.logger.info('Winner id {}'.format(id))
    song = Song.query.get_or_404(id)

    losers = request.form.getlist('losers[]')
    app.logger.info('Losers {}'.format(losers))
    ratings = set_match_result(song, losers)

    LastFm().show_some_love([song] + [r.song_loser for r in ratings])

    app.logger.info('Returning {} ratings: {}'.format(len(ratings), ratings))
    return ratings



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
            # for song in album.songs:
            #     setSongAlbum(song, album)
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
    recommendation = Recommendations().run()
    return recommendation

