"""adding-to-users

Revision ID: 47c2ca6546ea
Revises: ffdc0a98111c
Create Date: 2025-02-21 17:47:38.405034

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47c2ca6546ea'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('firstName', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('lastName', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('createdAt', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('updatedAt', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('profilePicture', sa.String(500), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('profilePicture')
        batch_op.drop_column('updatedAt')
        batch_op.drop_column('createdAt')
        batch_op.drop_column('lastName')
        batch_op.drop_column('firstName')
