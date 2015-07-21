#!flask/bin/python
import os
from app import app
from app.database import db_session, init_db

init_db()
app.config['MUSIC_FOLDER'] = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'app', 'static', 'music')
app.run(debug=True, host='0.0.0.0')

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

