"""empty message

Revision ID: 32a8891099c
Revises: 573027b82ae
Create Date: 2015-09-14 08:31:34.996676

"""

# revision identifiers, used by Alembic.
revision = '32a8891099c'
down_revision = '573027b82ae'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('song', sa.Column('days_since_played', sa.Integer()))
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
    NEW.days_since_played := EXTRACT(DAY FROM (NOW() - NEW.played_at));

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;
    '''))


def downgrade():
    op.drop_column('song', 'days_since_played')
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
