"""Added community models

Revision ID: 472b15628049
Revises: c6a90761fe11
Create Date: 2025-02-28 19:14:38.052695

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '472b15628049'
down_revision = 'c6a90761fe11'
branch_labels = None
depends_on = None


def upgrade():
    # Create CommunityPost table
    op.create_table(
        'community_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('userId', sa.Integer(), nullable=False),
        sa.Column('bookId', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('reviewText', sa.Text(), nullable=True),
        sa.Column('bookshelfId', sa.Integer(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
        sa.ForeignKeyConstraint(['bookId'], ['books.id'], ),
        sa.ForeignKeyConstraint(['bookshelfId'], ['bookshelves.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create CommunityComment table
    op.create_table(
        'community_comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('userId', sa.Integer(), nullable=False),
        sa.Column('activityId', sa.Integer(), nullable=False),
        sa.Column('like', sa.Boolean(), default=False, nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), nullable=False, default=sa.func.now()),
        sa.Column('updatedAt', sa.DateTime(), nullable=False, default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
        sa.ForeignKeyConstraint(['activityId'], ['community_posts.id'], ),
        sa.PrimaryKeyConstraint('id')
    )



def downgrade():
    # Drop CommunityComment table
    op.drop_table('community_comments')

    # Drop CommunityPost table
    op.drop_table('community_posts')
