from app.models import db, BookclubMember, environment, SCHEMA
from sqlalchemy.sql import text


def seed_bookclub_members():
    members = [
        # Kendra, Olivia, and Jaime
        BookclubMember(bookclubId=1, userId=1),
        BookclubMember(bookclubId=1, userId=2),
        BookclubMember(bookclubId=1, userId=3),

        # Jaime and Laura
        BookclubMember(bookclubId=2, userId=3),
        BookclubMember(bookclubId=2, userId=4),

        # Kendra and Donna's club
        BookclubMember(bookclubId=3, userId=1),
        BookclubMember(bookclubId=3, userId=5),
    ]

    for member in members:
            db.session.add(member)

    db.session.commit()
    print("Bookclub members have been seeded!")



def undo_bookclub_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bookclub_members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bookclub members"))
      
    db.session.commit()