docker cp db.dump speler_db_1:/

psql -U speler musiek < db.dump
