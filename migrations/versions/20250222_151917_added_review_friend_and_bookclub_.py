"""Added Review, Friend, and Bookclub Comments models


Revision ID: 97fdbfff1510
Revises: 4fdb34d3c817
Create Date: 2025-02-22 15:19:17.240700

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '97fdbfff1510'
down_revision = '4fdb34d3c817'
branch_labels = None
depends_on = None


def upgrade():
    # Create the 'reviews' table
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('bookId', sa.Integer(), sa.ForeignKey('books.id'), nullable=False),
        sa.Column('userId', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('review', sa.String(255), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('createdAt', sa.DateTime(), default=sa.func.current_timestamp(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(), default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp(), nullable=False)
    )

    # Create the 'friends' table
    op.create_table(
        'friends',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('userId', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('friendId', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'accepted', 'rejected', name='friend_status'), nullable=False, default='pending'),
        sa.Column('createdAt', sa.DateTime(), default=sa.func.current_timestamp(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(), default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp(), nullable=False)
    )

    # Create the 'bookclub_comments' table
    op.create_table(
        'bookclub_comments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('bookclubId', sa.Integer(), sa.ForeignKey('bookclubs.id'), nullable=False),
        sa.Column('bookId', sa.Integer(), sa.ForeignKey('books.id'), nullable=False),
        sa.Column('userId', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('chapter', sa.Integer(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), default=sa.func.current_timestamp(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(), default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp(), nullable=False)
    )

def downgrade():
    # Drop the 'reviews' table
    op.drop_table('reviews')

    # Drop the 'friends' table
    op.drop_table('friends')

    # Drop the 'bookclub_comments' table
    op.drop_table('bookclub_comments')
