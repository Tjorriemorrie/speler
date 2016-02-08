"""adding album trigger

Revision ID: 003
Revises: 002
Create Date: 2015-11-06 07:56:12.062064

"""

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'

from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
CREATE OR REPLACE FUNCTION update_album ()
  RETURNS trigger
AS
$BODY$
  DECLARE
    v_count_songs integer;
    v_count_played integer;
    v_max_played timestamp;
    v_count_rated integer;
    v_max_rated timestamp;
    v_avg_rating float;
BEGIN

    -- count_songs
    SELECT COUNT(*) INTO STRICT v_count_songs FROM song WHERE album_id = NEW.album_id;

    -- count_played
    SELECT SUM(count_played) INTO STRICT v_count_played FROM song WHERE album_id = NEW.album_id;

    -- played_at
    SELECT MAX(played_at) INTO STRICT v_max_played FROM song WHERE album_id = NEW.album_id;

    -- count_rated
    SELECT SUM(count_rated) INTO STRICT v_count_rated FROM song WHERE album_id = NEW.album_id;

    -- rated_at
    SELECT MAX(rated_at) INTO STRICT v_max_rated FROM song WHERE album_id = NEW.album_id;

    -- rating
    SELECT AVG(rating) INTO STRICT v_avg_rating FROM song WHERE album_id = NEW.album_id;

    UPDATE album SET
        count_songs = v_count_songs,
        count_played = v_count_played,
        played_at = v_max_played,
        count_rated = v_count_rated,
        rated_at = v_max_rated,
        rating = v_avg_rating
    WHERE id = new.album_id;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


CREATE TRIGGER update_album_trigger
AFTER UPDATE ON song
FOR EACH ROW
EXECUTE PROCEDURE update_album();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_album_trigger ON song;
DROP FUNCTION update_album();
    '''))
