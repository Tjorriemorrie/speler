"""empty message

Revision ID: 1d4a5706ee0
Revises: 836abf6084
Create Date: 2015-08-25 07:47:02.652590

"""

# revision identifiers, used by Alembic.
revision = '1d4a5706ee0'
down_revision = '836abf6084'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('uq_album_name_artist', 'album', ['artist_id', 'name'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uq_album_name_artist', 'album')
    ### end Alembic commands ###