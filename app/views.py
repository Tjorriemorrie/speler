from app import app
from flask import request, render_template, Response
from app.models import Song, Queue, History
from app.manager import scanDirectory, getSelections, addSongToQueue, createHistory, validateSongs, createRatings
from flask.ext.jsontools import jsonapi


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('base.html')


@app.route('/find/files')
@jsonapi
def findFiles():
    songs = Song.query.order_by(
        Song.priority.desc(),
        Song.rating.desc(),
        Song.count_played.desc(),
        Song.updated_at.desc(),
        Song.path_name.asc(),
    ).all()
    app.logger.info('{} songs found'.format(len(songs)))
    return songs


@app.route('/scan/dir')
@jsonapi
def scanDir():
    lost_count = validateSongs()
    new_count = scanDirectory()
    return {
        'new': new_count,
        'lost': lost_count,
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
