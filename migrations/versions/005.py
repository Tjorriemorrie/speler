"""create update priority trigger

Revision ID: 005
Revises: 004
Create Date: 2015-11-06 08:08:02.671956

"""

# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'

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
    v_max_rated integer;
    v_weight_rated float;
    v_days_since_avg_played_at integer;
BEGIN

    -- played weighting
    SELECT max(count_played) INTO STRICT v_max_played FROM song;
    v_weight_played := GREATEST(NEW.count_played, 1) / CAST(GREATEST(v_max_played, 1) AS float);

    -- rated weighting
    SELECT max(count_rated) INTO STRICT v_max_rated FROM song;
    v_weight_rated := GREATEST(NEW.count_rated, 1) / CAST(GREATEST(v_max_rated, 1) AS float);

    -- set priority 200 rating -50 played -50 rated
    NEW.priority := (NEW.rating * 2.00) - (v_weight_played * 0.50) - (v_weight_rated * 0.50);

    -- avg played
    SELECT EXTRACT(DAY FROM (NOW() - TO_TIMESTAMP(AVG(EXTRACT(EPOCH FROM played_at))))) INTO STRICT v_days_since_avg_played_at FROM song;
    NEW.days_since_played := v_days_since_avg_played_at;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;


CREATE TRIGGER update_priority_trigger
BEFORE UPDATE ON song
FOR EACH ROW
EXECUTE PROCEDURE update_priority();
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_priority_trigger ON song;
DROP FUNCTION update_priority;
    '''))
