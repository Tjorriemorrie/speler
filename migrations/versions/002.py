"""adding constraints and unique fields on artist and album

Revision ID: 002
Revises: 001
Create Date: 2015-11-06 07:54:44.518537

"""

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('album', sa.Column('name_id', sa.String(length=255), nullable=False))
    op.add_column('artist', sa.Column('name_id', sa.String(length=255), nullable=True))
    op.create_unique_constraint(None, 'artist', ['name_id'])
    op.create_unique_constraint('uq_album_name_artist', 'album', ['artist_id', 'name_id'])


def downgrade():
    op.drop_constraint('uq_album_name_artist', 'album')
    op.drop_constraint(None, 'artist', type_='unique')
    op.drop_column('artist', 'name_id')
    op.drop_column('album', 'name_id')
