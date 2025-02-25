"""Added all other models

Revision ID: 4fdb34d3c817
Revises: 47c2ca6546ea
Create Date: 2025-02-22 14:24:54.439936

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4fdb34d3c817'
down_revision = '47c2ca6546ea'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('genres',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('books',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('author', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('genreId', sa.Integer(), nullable=False),
    sa.Column('isbn', sa.Integer(), nullable=False),
    sa.Column('pages', sa.Integer(), nullable=False),
    sa.Column('chapters', sa.Integer(), nullable=False),
    sa.Column('coverPicture', sa.String(length=500), nullable=False),
    sa.Column('yearPublished', sa.Integer(), nullable=False),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['genreId'], ['genres.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookshelves',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookclubs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ownerId', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('bookId', sa.Integer(), nullable=True),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['bookId'], ['books.id'], ),
    sa.ForeignKeyConstraint(['ownerId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookshelf_books',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('bookshelfId', sa.Integer(), nullable=False),
    sa.Column('bookId', sa.Integer(), nullable=False),
    sa.Column('addedAt', sa.DateTime(), nullable=False),
    sa.Column('orderInShelf', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['bookId'], ['books.id'], ),
    sa.ForeignKeyConstraint(['bookshelfId'], ['bookshelves.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('community_posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('activityType', sa.Enum('add_tbr', 'add_reading', 'add_read', 'rate', 'review', 'update_status', name='activitytypeenum'), nullable=False),
    sa.Column('bookId', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('reviewText', sa.Text(), nullable=True),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['bookId'], ['books.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookclub_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('bookclubId', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('joinedAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['bookclubId'], ['bookclubs.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('community_comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('activityId', sa.Integer(), nullable=False),
    sa.Column('reactionType', sa.Enum('LIKE', 'COMMENT', name='reactiontypeenum'), nullable=False),
    sa.Column('comment', sa.Text(), nullable=True),
    sa.Column('createdAt', sa.DateTime(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['activityId'], ['community_posts.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('community_comments')
    op.drop_table('bookclub_members')
    op.drop_table('community_posts')
    op.drop_table('bookshelf_books')
    op.drop_table('bookclubs')
    op.drop_table('bookshelves')
    op.drop_table('books')
    op.drop_table('genres')
    # ### end Alembic commands ###
