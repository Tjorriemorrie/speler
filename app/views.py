from app import app
from flask import request, render_template, Response
from app.models import Song, Queue, History, Artist
from app.manager import scanDirectory, getSelections, addSongToQueue, createHistory, validateSongs, createRatings, parseId3Tags
from flask.ext.jsontools import jsonapi


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('base.html')


@app.route('/find/<grouping>')
@jsonapi
def findFiles(grouping):
    items = []
    app.logger.info('grouping = {}'.format(grouping))

    if grouping == 'files':
        items = Song.query.order_by(
            Song.priority.desc(),
            Song.rating.desc(),
            Song.count_played.desc(),
            Song.updated_at.desc(),
            Song.path_name.asc(),
        ).limit(20).all()

    elif grouping == 'artists':
        items = Artist.query.limit(20).all()

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
