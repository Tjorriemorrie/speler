"""adding artist trigger

Revision ID: 004
Revises: 003
Create Date: 2015-11-06 08:00:50.481484

"""

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'

from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
CREATE OR REPLACE FUNCTION update_artist ()
  RETURNS trigger
AS
$BODY$
  DECLARE
    v_count_songs integer;
    v_count_albums integer;
    v_count_played integer;
    v_max_played timestamp;
    v_count_rated integer;
    v_max_rated timestamp;
    v_avg_rating float;
BEGIN

    -- count_songs
    SELECT SUM(count_songs) INTO STRICT v_count_songs FROM album WHERE artist_id = NEW.artist_id;

    -- count_albums
    SELECT COUNT(id) INTO STRICT v_count_albums FROM album WHERE artist_id = NEW.artist_id;

    -- count_played
    SELECT SUM(count_played) INTO STRICT v_count_played FROM album WHERE artist_id = NEW.artist_id;

    -- played_at
    SELECT MAX(played_at) INTO STRICT v_max_played FROM album WHERE artist_id = NEW.artist_id;

    -- count_rated
    SELECT SUM(count_rated) INTO STRICT v_count_rated FROM album WHERE artist_id = NEW.artist_id;

    -- rated_at
    SELECT MAX(rated_at) INTO STRICT v_max_rated FROM album WHERE artist_id = NEW.artist_id;

    -- rating
    SELECT AVG(rating) INTO STRICT v_avg_rating FROM album WHERE artist_id = NEW.artist_id;

    UPDATE artist SET
        count_songs = v_count_songs,
        count_albums = v_count_albums,
        count_played = v_count_played,
        played_at = v_max_played,
        count_rated = v_count_rated,
        rated_at = v_max_rated,
        rating = v_avg_rating
    WHERE id = NEW.artist_id;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


CREATE TRIGGER update_artist_trigger
AFTER UPDATE ON album
FOR EACH ROW
EXECUTE PROCEDURE update_artist();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_artist_trigger ON album;
DROP FUNCTION update_artist();
    '''))
