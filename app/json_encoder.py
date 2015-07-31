from sqlalchemy.ext.declarative import DeclarativeMeta
from flask import json


class AlchemyEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o.__class__, DeclarativeMeta):
            data = {}
            fields = o.__json__() if hasattr(o, '__json__') else dir(o)
            for field in [f for f in fields if not f.startswith('_') and f not in ['metadata', 'query', 'query_class']]:
                value = o.__getattribute__(field)
                try:
                    json.dumps(value)
                    data[field] = value
                except TypeError:
                    data[field] = None
            return data
        return json.JSONEncoder.default(self, o)


trigger_update_played = '''

CREATE OR REPLACE FUNCTION update_played ()
  RETURNS trigger
AS
$BODY$
  DECLARE
    v_count_played integer;
    v_last_played timestamp;
BEGIN

    SELECT count(*) INTO STRICT v_count_played FROM history WHERE song_id = NEW.song_id;
    SELECT max(played_at) INTO STRICT v_last_played FROM history WHERE song_id = NEW.song_id;

    EXECUTE 'UPDATE song
        SET count_played = $1, played_at = $2
        WHERE id = $3'
        USING v_count_played, v_last_played, NEW.song_id;

    RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


create trigger update_played_trigger
after insert on history
for each row
execute procedure update_played();
'''


trigger_update_rated = '''
CREATE OR REPLACE FUNCTION update_rated ()
  RETURNS trigger
AS
$BODY$
  DECLARE
    v_count_won integer;
    v_count_lost integer;
    v_count_rated integer;
    v_rating float;
BEGIN

    -- update winner
    SELECT count(*) INTO STRICT v_count_won FROM rating WHERE song_winner_id = NEW.song_winner_id;
    SELECT count(*) INTO STRICT v_count_lost FROM rating WHERE song_loser_id = NEW.song_winner_id;
    v_count_rated := v_count_won + v_count_lost;
    v_rating := v_count_won / cast(v_count_rated AS float);
    EXECUTE 'UPDATE song
        SET count_rated = $1, rated_at = $2, rating = $3
        WHERE id = $4'
        USING v_count_rated, NEW.rated_at, v_rating, NEW.song_winner_id;

    -- update loser
    SELECT count(*) INTO STRICT v_count_won FROM rating WHERE song_winner_id = NEW.song_loser_id;
    SELECT count(*) INTO STRICT v_count_lost FROM rating WHERE song_loser_id = NEW.song_loser_id;
    v_count_rated := v_count_won + v_count_lost;
    v_rating := v_count_won / cast(v_count_rated AS float);
    EXECUTE 'UPDATE song
        SET count_rated = $1, rated_at = $2, rating = $3
        WHERE id = $4'
        USING v_count_rated, NEW.rated_at, v_rating, NEW.song_loser_id;

    RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


create trigger update_rated_trigger
after insert on rating
for each row
execute procedure update_rated();
'''


trigger_song = '''
CREATE OR REPLACE FUNCTION update_priority ()
  RETURNS trigger
AS
$BODY$
  DECLARE
    v_count_played integer;
    v_max_played integer;
    v_weight_played float;
    v_max_rated integer;
    v_weight_rated float;
    v_priority float;
BEGIN

    -- played weighting
    SELECT max(count_played) INTO STRICT v_max_played FROM song;
    v_weight_played := GREATEST(NEW.count_played, 1) / CAST(GREATEST(v_max_played, 1) AS float);

    -- rated weighting
    SELECT max(count_rated) INTO STRICT v_max_rated FROM song;
    v_weight_rated := GREATEST(NEW.count_rated, 1) / CAST(GREATEST(v_max_rated, 1) AS float);

    -- set priority 80/20
    NEW.priority := v_weight_rated - (v_weight_played * 0.80);
    NEW.updated_at := CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


create trigger update_priority_trigger
before update on song
for each row
execute procedure update_priority();

'''