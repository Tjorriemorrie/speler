"""empty message

Revision ID: 9046135b98
Revises: 236b56e8ef1
Create Date: 2015-09-08 15:03:10.322335

"""

# revision identifiers, used by Alembic.
revision = '9046135b98'
down_revision = '236b56e8ef1'

from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
CREATE OR REPLACE FUNCTION update_priority ()
  RETURNS TRIGGER
AS
$BODY$
  DECLARE
    v_max_played integer;
    v_weight_played float;
BEGIN

    -- played weighting
    SELECT max(count_played) INTO STRICT v_max_played FROM song;
    v_weight_played := GREATEST(NEW.count_played, 1) / CAST(GREATEST(v_max_played, 1) AS float);

    -- set priority 80/20
    NEW.priority := (NEW.rating * 0.80) + ((1.0 - v_weight_played) * 0.20);

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
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
    '''))