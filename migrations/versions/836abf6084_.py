"""empty message

Revision ID: 836abf6084
Revises: 3aa01600e8e
Create Date: 2015-08-24 16:27:38.783737

"""

# revision identifiers, used by Alembic.
revision = '836abf6084'
down_revision = '3aa01600e8e'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('album', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('album', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    ### end Alembic commands ###