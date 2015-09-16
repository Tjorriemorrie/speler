"""empty message

Revision ID: 2c39d989c76
Revises: 436741c349
Create Date: 2015-09-14 14:08:49.665589

"""

# revision identifiers, used by Alembic.
revision = '2c39d989c76'
down_revision = '436741c349'

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
    v_max_rated integer;
    v_weight_rated float;
    v_days_since_avg_played_at integer;
BEGIN

    -- rated weighting
    SELECT max(count_rated) INTO STRICT v_max_rated FROM song;
    v_weight_rated := GREATEST(NEW.count_rated, 1) / CAST(GREATEST(v_max_rated, 1) AS float);

    -- set priority 80/20
    NEW.priority := (NEW.rating * 0.80) + ((1.0 - v_weight_rated) * 0.20);

    -- avg played
    SELECT EXTRACT(DAY FROM (NOW() - TO_TIMESTAMP(AVG(EXTRACT(EPOCH FROM played_at))))) INTO STRICT v_days_since_avg_played_at FROM song;
    NEW.days_since_played := v_days_since_avg_played_at;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;
    '''))


def downgrade():
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
CREATE OR REPLACE FUNCTION update_priority ()
  RETURNS TRIGGER
AS
$BODY$
  DECLARE
    v_max_rated integer;
    v_weight_rated float;
    v_avg_played timestamp;
BEGIN

    -- rated weighting
    SELECT max(count_rated) INTO STRICT v_max_rated FROM song;
    v_weight_rated := GREATEST(NEW.count_rated, 1) / CAST(GREATEST(v_max_rated, 1) AS float);

    -- set priority 80/20
    NEW.priority := (NEW.rating * 0.80) + ((1.0 - v_weight_rated) * 0.20);

    -- avg played
    SELECT TO_TIMESTAMP(AVG(EXTRACT(EPOCH FROM played_at))) INTO STRICT v_avg_played FROM song;

    -- set days_since_played
    NEW.days_since_played := GREATEST(1, EXTRACT(DAY FROM (NOW() - NEW.played_at)));

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;
    '''))
