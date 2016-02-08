"""Updating song on played

Revision ID: 006
Revises: 005
Create Date: 2015-11-24 12:39:30.070060

"""

# revision identifiers, used by Alembic.
revision = '006'
down_revision = '005'

from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
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



CREATE TRIGGER update_played_trigger
AFTER INSERT ON history
FOR EACH ROW
EXECUTE PROCEDURE update_played();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_played_trigger ON history;
DROP FUNCTION update_played();
    '''))
