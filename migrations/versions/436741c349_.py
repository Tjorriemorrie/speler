"""empty message

Revision ID: 436741c349
Revises: 32a8891099c
Create Date: 2015-09-14 08:46:58.748460

"""

# revision identifiers, used by Alembic.
revision = '436741c349'
down_revision = '32a8891099c'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.alter_column('song', 'days_since_played',
               existing_type=sa.INTEGER(),
               nullable=False)
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


def downgrade():
    op.alter_column('song', 'days_since_played',
               existing_type=sa.INTEGER(),
               nullable=True)
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
