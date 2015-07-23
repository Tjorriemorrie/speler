import os
import json
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['MUSIC_FOLDER'] = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static', 'music')


# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://speler:spe1er@db:5432/musiek'
db = SQLAlchemy(app)


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from app import models

    db.create_all()


# json encoding
from app.json_encoder import AlchemyEncoder
app.json_encoder = AlchemyEncoder


# load routing
from app import views