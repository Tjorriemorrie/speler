"""Trigger after song rated

Revision ID: 007
Revises: 006
Create Date: 2015-11-24 12:43:07.485511

"""

# revision identifiers, used by Alembic.
revision = '007'
down_revision = '006'

from alembic import op
import sqlalchemy as sa


def upgrade():
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


create trigger update_rated_trigger
AFTER INSERT ON rating
for each row
execute procedure update_rated();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_rated_trigger ON rating;
DROP FUNCTION update_rated();
    '''))
