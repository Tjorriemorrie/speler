"""drop priority column

Revision ID: 011
Revises: 010
Create Date: 2017-07-19 03:23:58.197907

"""

# revision identifiers, used by Alembic.
revision = '011'
down_revision = '010'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.drop_column('song', 'priority')
    conn = op.get_bind()
    conn.execute(sa.sql.text('''
DROP TRIGGER update_priority_trigger ON song;
DROP FUNCTION update_priority();
    '''))


def downgrade():
    op.add_column('song', sa.Column('priority', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))

    conn = op.get_bind()
    conn.execute(sa.sql.text('''
    CREATE OR REPLACE FUNCTION update_priority()
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

        -- set priority with rating reduced by play count
        NEW.priority := NEW.rating - v_weight_played;

        RETURN NEW;
    END;
    $BODY$
    LANGUAGE plpgsql VOLATILE;


CREATE TRIGGER update_priority_trigger
BEFORE UPDATE ON song
FOR EACH ROW
EXECUTE PROCEDURE update_priority();
    '''))
