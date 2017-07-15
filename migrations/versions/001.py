"""base tables

Revision ID: 4e8afd9354a
Revises: None
Create Date: 2015-11-05 21:07:09.993388

"""

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table('artist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('count_songs', sa.Integer(), nullable=True),
    sa.Column('count_albums', sa.Integer(), nullable=True),
    sa.Column('count_played', sa.Integer(), nullable=True),
    sa.Column('played_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('count_rated', sa.Integer(), nullable=True),
    sa.Column('rated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('album',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('total_tracks', sa.Integer(), nullable=True),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('disc_number', sa.Integer(), server_default='1', nullable=True),
    sa.Column('total_discs', sa.Integer(), server_default='1', nullable=True),
    sa.Column('artist_id', sa.Integer(), nullable=True),
    sa.Column('count_songs', sa.Integer(), nullable=True),
    sa.Column('count_played', sa.Integer(), nullable=True),
    sa.Column('played_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('count_rated', sa.Integer(), nullable=True),
    sa.Column('rated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['artist_id'], ['artist.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('song',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('abs_path', sa.String(length=255), nullable=True),
    sa.Column('web_path', sa.String(length=255), nullable=True),
    sa.Column('path_name', sa.String(length=255), nullable=True),
    sa.Column('id3_parsed', sa.Boolean(), server_default='false', nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('track_number', sa.Integer(), nullable=True),
    sa.Column('album_id', sa.Integer(), nullable=True),
    sa.Column('artist_id', sa.Integer(), nullable=True),
    sa.Column('count_played', sa.Integer(), server_default='0', nullable=False),
    sa.Column('played_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('rated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('count_rated', sa.Integer(), server_default='0', nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('priority', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['album.id'], ),
    sa.ForeignKeyConstraint(['artist_id'], ['artist.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('abs_path'),
    sa.UniqueConstraint('path_name'),
    sa.UniqueConstraint('web_path')
    )
    op.create_table('history',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=False),
    sa.Column('played_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('queue',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=False),
    sa.Column('src', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('song_id')
    )
    op.create_table('rating',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('song_winner_id', sa.Integer(), nullable=True),
    sa.Column('song_loser_id', sa.Integer(), nullable=True),
    sa.Column('rated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['song_loser_id'], ['song.id'], ),
    sa.ForeignKeyConstraint(['song_winner_id'], ['song.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('rating')
    op.drop_table('queue')
    op.drop_table('history')
    op.drop_table('song')
    op.drop_table('album')
    op.drop_table('artist')
