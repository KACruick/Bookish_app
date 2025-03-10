"""adding-to-users

Revision ID: e58c9449f0e9
Revises: ffdc0a98111c
Create Date: 2025-02-25 17:33:53.386148

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime, timezone
from sqlalchemy import DateTime, String


# revision identifiers, used by Alembic.
revision = 'e58c9449f0e9'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('firstName', sa.String(225), nullable=False))
        batch_op.add_column(sa.Column('lastName', sa.String(225), nullable=False))
        batch_op.add_column(sa.Column('createdAt', sa.DateTime, default=datetime.now(timezone.utc), nullable=False))
        batch_op.add_column(sa.Column('updatedAt', sa.DateTime, default=datetime.now(timezone.utc), nullable=False))
        batch_op.add_column(sa.Column('profilePicture', sa.String(500), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('firstName')
        batch_op.drop_column('lastName')
        batch_op.drop_column('createdAt')
        batch_op.drop_column('updatedAt')
        batch_op.drop_column('profilePicture')
