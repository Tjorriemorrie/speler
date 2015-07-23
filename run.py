#!flask/bin/python
from app import app, init_db

init_db()
app.run(debug=True, host='0.0.0.0')
