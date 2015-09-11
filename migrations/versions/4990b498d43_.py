"""empty message

Revision ID: 4990b498d43
Revises: 9046135b98
Create Date: 2015-09-11 09:29:21.800103

"""

# revision identifiers, used by Alembic.
revision = '4990b498d43'
down_revision = '9046135b98'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('song', 'count_played',
               existing_type=sa.INTEGER(),
               nullable=False,
               existing_server_default=sa.text('0'))
    op.alter_column('song', 'count_rated',
               existing_type=sa.INTEGER(),
               nullable=False,
               existing_server_default=sa.text('0'))
    op.alter_column('song', 'played_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.alter_column('song', 'priority',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False,
               existing_server_default=sa.text('0.5::double precision'))
    op.alter_column('song', 'rated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False,
               existing_server_default=sa.text('now()'))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('song', 'rated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('song', 'priority',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True,
               existing_server_default=sa.text('0.5::double precision'))
    op.alter_column('song', 'played_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('song', 'count_rated',
               existing_type=sa.INTEGER(),
               nullable=True,
               existing_server_default=sa.text('0'))
    op.alter_column('song', 'count_played',
               existing_type=sa.INTEGER(),
               nullable=True,
               existing_server_default=sa.text('0'))
    ### end Alembic commands ###
