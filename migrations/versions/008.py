"""removing days_since_played

postgresql upgraded to 9.6 before running this. created these orphan
tables.

Revision ID: 008
Revises: 007
Create Date: 2017-07-15 02:27:39.912812

"""

# revision identifiers, used by Alembic.
revision = '008'
down_revision = '007'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.drop_column('song', 'days_since_played')


def downgrade():
    op.add_column('song', sa.Column('days_since_played', sa.INTEGER(), autoincrement=False, nullable=False))
