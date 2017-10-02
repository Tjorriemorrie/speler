"""update winner only after rating deleted

Revision ID: 013
Revises: 012
Create Date: 2017-09-07 05:28:46.345289

"""

# revision identifiers, used by Alembic.
revision = '013'
down_revision = '012'

from alembic import op
import sqlalchemy as sa


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
    CREATE OR REPLACE FUNCTION recalculate_winner()
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
        SELECT count(*) INTO STRICT v_count_won FROM rating WHERE song_winner_id = OLD.song_winner_id;
        SELECT count(*) INTO STRICT v_count_lost FROM rating WHERE song_loser_id = OLD.song_winner_id;
        v_count_rated := v_count_won + v_count_lost;
        IF v_count_rated < 1 THEN
          v_rating := 0.5;
        ELSE
          v_rating := v_count_won / cast(v_count_rated AS float);
        END IF;
        EXECUTE 'UPDATE song
            SET count_rated = $1, rated_at = $2, rating = $3
            WHERE id = $4'
            USING v_count_rated, OLD.rated_at, v_rating, OLD.song_winner_id;

        RETURN NULL;

    END;
    $BODY$
    LANGUAGE plpgsql VOLATILE;


    CREATE TRIGGER recalculate_winner_trigger
    AFTER DELETE ON rating
    FOR EACH ROW
    EXECUTE PROCEDURE recalculate_winner();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
        DROP TRIGGER recalculate_winner_trigger ON rating;
        DROP FUNCTION recalculate_winner();
    '''))
