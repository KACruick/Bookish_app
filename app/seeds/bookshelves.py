from app.models import db, Bookshelf, environment, SCHEMA
from sqlalchemy.sql import text


def seed_bookshelves():
    bookshelves = [
        # kendra 3 shelves
        Bookshelf(userId=1, name="Read"),
        Bookshelf(userId=1, name="Currently reading"),
        Bookshelf(userId=1, name="Want to read"),

        Bookshelf(userId=2, name="Read"),
        Bookshelf(userId=2, name="Currently reading"),
        Bookshelf(userId=2, name="Want to read"),

        Bookshelf(userId=3, name="Read"),
        Bookshelf(userId=3, name="Currently reading"),
        Bookshelf(userId=3, name="Want to read"),

        Bookshelf(userId=4, name="Read"),
        Bookshelf(userId=4, name="Currently reading"),
        Bookshelf(userId=4, name="Want to read"),

        Bookshelf(userId=5, name="Read"),
        Bookshelf(userId=5, name="Currently reading"),
        Bookshelf(userId=5, name="Want to read"),
    ]

    for bookshelf in bookshelves:
            db.session.add(bookshelf)

    db.session.commit()
    print("Bookshelves have been seeded!")



def undo_bookshelves():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookshelves RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM Bookshelves"))
      
    db.session.commit()