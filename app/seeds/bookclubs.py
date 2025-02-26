from app.models import db, Bookclub, environment, SCHEMA
from sqlalchemy.sql import text


def seed_bookclubs():
    clubs = [
        Bookclub(ownerId=1, name="Red Light", description="Fantasy only!", bookId=3),
        Bookclub(ownerId=4, name="Evergreen Besties", description="Usually we read a cute rom-com!", bookId=16),
        Bookclub(ownerId=5, name="Lumen Bookclub", description="Rotating through genres", bookId=21)
    ]

    for club in clubs:
            db.session.add(club)

    db.session.commit()
    print("Bookclubs have been seeded!")



def undo_bookclubs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookclubs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bookclubs"))
      
    db.session.commit()