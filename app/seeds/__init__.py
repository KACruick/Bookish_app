from flask.cli import AppGroup
from .users import seed_users, undo_users
from .books import seed_books, undo_books
from .genres import seed_genres, undo_genres
from .friends import seed_friends, undo_friends
from .reviews import seed_reviews, undo_reviews
from .bookshelves import seed_bookshelves, undo_bookshelves
from .bookshelf_books import seed_bookshelf_books, undo_bookshelf_books
from .bookclubs import seed_bookclubs, undo_bookclubs
from .bookclub_members import seed_bookclub_members, undo_bookclub_members
from .bookclub_comments import seed_bookclub_comments, undo_bookclub_comments
# from .community_posts import seed_community_posts, undo_community_posts
# from .community_comments import seed_community_comments, undo_community_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_genres()
        undo_books()
        undo_friends()
        undo_reviews()
        undo_bookshelves()
        undo_bookshelf_books()
        undo_bookclubs()
        undo_bookclub_members()
        undo_bookclub_comments()
        # undo_community_posts()
        # undo_community_comments()


    seed_users()
    seed_genres()
    seed_books()
    seed_friends()
    seed_reviews()
    seed_bookshelves()
    seed_bookshelf_books()
    seed_bookclubs()
    seed_bookclub_members()
    seed_bookclub_comments()
    # seed_community_posts()
    # seed_community_comments()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_friends()
    undo_books()
    undo_genres()
    undo_users()
    undo_reviews()
    undo_bookshelves()
    undo_bookshelf_books()
    undo_bookclubs()
    undo_bookclub_members()
    undo_bookclub_comments()
    # undo_community_posts()
    # undo_community_comments()