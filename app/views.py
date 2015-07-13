from app import app
from flask import render_template, Response
import os
import json


@app.route('/')
def index():
    return render_template('base.html')


@app.route('/scan/dir')
def scan():
    for root, dirs, files in os.walk('/var/lib/music'):
        print(root, "consumes", end=" ")
        print(sum(os.path.getsize(os.path.join(root, name)) for name in files), end=" ")
        print("bytes in", len(files), "non-directory files")
    return Response(200)


@app.route('/find/files')
def findFiles():
    data = json.dumps([
        {"name": 'foo', "path": 'foo.mp3'},
        {"name": 'bar', "path": 'bar.mp3'},
    ])
    return Response(
        response=data,
        status=200,
        mimetype="application/json",
    )