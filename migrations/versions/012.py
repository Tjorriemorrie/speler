"""create similars

Revision ID: 012
Revises: 011
Create Date: 2017-08-01 03:28:31.686504

"""

# revision identifiers, used by Alembic.
revision = '012'
down_revision = '011'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'similar',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('song_id', sa.Integer(), nullable=True),
        sa.Column('artist_name', sa.String(length=255), nullable=True),
        sa.Column('album_name', sa.String(length=255), nullable=True),
        sa.Column('track_name', sa.String(length=255), nullable=True),
        sa.Column('similarity', sa.Float(), nullable=True),
        sa.Column('scraped_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['song_id'], ['song.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('similar')