import os
import json
from flask import Flask
from flask_script import Manager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand


app = Flask(__name__)
app.config['MUSIC_FOLDER'] = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static', 'music')

# database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://speler:spe1er@db:5432/musiek'
db = SQLAlchemy(app)

# migrations
migrate = Migrate(app, db)

# json encoding
from app.json_encoder import AlchemyEncoder
app.json_encoder = AlchemyEncoder

# load routing
from app import views

# create manager
manager = Manager(app)
manager.add_command('db', MigrateCommand)

# set avg played date
from app.models import Song
avg_days_last_played = Song.query.with_entities(
    db.func.avg(db.func.extract(db.text('DAY'), db.func.now() - Song.played_at))
).scalar()
app.logger.info('AVG days last played {}'.format(avg_days_last_played))
app.config['AVG_DAYS_LAST_PLAYED'] = float(max(avg_days_last_played, 1))