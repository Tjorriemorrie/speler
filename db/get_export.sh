docker exec -i speler_db_1 pg_dumpall -v -f db.dump -U speler

docker cp speler_db_1:/db.dump .
