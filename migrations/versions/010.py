"""drop weird tables that seems to be there

Revision ID: 010
Revises: 009
Create Date: 2017-07-19 02:53:31.567550

"""

# revision identifiers, used by Alembic.
revision = '010'
down_revision = '009'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.drop_constraint('uq_album_name_artist', 'album', type_='unique')
    op.drop_table('users')
    op.drop_table('songs')
    op.drop_table('albums', )
    op.drop_table('artists')


def downgrade():
    op.create_unique_constraint('uq_album_name_artist', 'album', ['artist_id', 'name_id'])
    op.create_table('artists',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('artists_id_seq'::regclass)"), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('count_songs', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('count_albums', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('count_played', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('played_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='artists_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('songs',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('album_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('artist_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('path', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('number', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('played_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('count_played', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('priority', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['albums.id'], name='songs_album_id_fkey'),
    sa.ForeignKeyConstraint(['artist_id'], ['artists.id'], name='songs_artist_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='songs_pkey'),
    sa.UniqueConstraint('path', name='songs_path_key')
    )
    op.create_table('albums',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('artist_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('size', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('year', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('count_songs', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('count_played', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('played_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['artist_id'], ['artists.id'], name='albums_artist_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='albums_pkey')
    )
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='users_pkey'),
    sa.UniqueConstraint('email', name='users_email_key'),
    sa.UniqueConstraint('name', name='users_name_key')
    )
