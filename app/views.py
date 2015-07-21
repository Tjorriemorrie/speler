from app import app
from flask import render_template, Response
from app.models import Song, Album, Artist
from app.manager import scanDirectory
import json


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('base.html')


@app.route('/find/files')
def findFiles():
    songs = Song.query.all()
    app.logger.info('{} songs found'.format(len(songs)))
    data = json.dumps([
        '/static/music/foo.mp3'
    ])
    return Response(
        response=data,
        status=200,
        mimetype="application/json",
    )


@app.route('/scan/dir')
def scanDir():
    scanDirectory()
    return Response(status=200)
